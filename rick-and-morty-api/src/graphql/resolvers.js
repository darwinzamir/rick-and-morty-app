const { Op } = require('sequelize');
const Character = require('../models/Character');
const Comment = require('../models/Comment');
const Favorite = require('../models/Favorite');
const redisClient = require('../config/redis');

const resolvers = {
  characters: async ({ name, status, species, gender, origin, sortBy }) => {
    const cacheKey = `rym:characters:${JSON.stringify({ name, status, species, gender, origin, sortBy })}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('📦 Datos desde caché Redis');
        return JSON.parse(cached);
      }
    } catch (e) {}

    const where = { is_deleted: false };
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (status) where.status = status;
    if (species) where.species = { [Op.like]: `%${species}%` };
    if (gender) where.gender = gender;
    if (origin) where.origin = { [Op.like]: `%${origin}%` };

    const order = sortBy === 'Z-A' ? [['name', 'DESC']] : [['name', 'ASC']];

    const characters = await Character.findAll({ where, order });
    const favorites = await Favorite.findAll();
    const favIds = new Set(favorites.map(f => f.character_id));

    const result = await Promise.all(characters.map(async (c) => {
      const comments = await Comment.findAll({ where: { character_id: c.id } });
      return {
        ...c.toJSON(),
        comments: comments.map(cm => ({
          ...cm.toJSON(),
          createdAt: cm.createdAt?.toISOString()
        })),
        isFavorite: favIds.has(c.id)
      };
    }));

    try {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
    } catch (e) {}

    return result;
  },

  character: async ({ id }) => {
    const c = await Character.findByPk(id);
    if (!c) return null;
    const comments = await Comment.findAll({ where: { character_id: id } });
    const favorite = await Favorite.findOne({ where: { character_id: id } });
    return {
      ...c.toJSON(),
      comments: comments.map(cm => ({
        ...cm.toJSON(),
        createdAt: cm.createdAt?.toISOString()
      })),
      isFavorite: !!favorite
    };
  },

  addComment: async ({ character_id, author, content }) => {
    const comment = await Comment.create({
      character_id,
      author: author || 'Anonymous',
      content
    });
    try {
      const keys = await redisClient.keys('rym:characters:*');
      if (keys.length) await redisClient.del(keys);
    } catch (e) {}
    return { ...comment.toJSON(), createdAt: comment.createdAt?.toISOString() };
  },

  toggleFavorite: async ({ character_id }) => {
    const existing = await Favorite.findOne({ where: { character_id } });
    if (existing) {
      await existing.destroy();
      return false;
    }
    await Favorite.create({ character_id });
    return true;
  },

  softDeleteCharacter: async ({ id }) => {
    await Character.update({ is_deleted: true }, { where: { id } });
    try {
      const keys = await redisClient.keys('rym:characters:*');
      if (keys.length) await redisClient.del(keys);
    } catch (e) {}
    return true;
  }
};

module.exports = resolvers;