// GraphQL resolvers for the Rick and Morty API.
// Each resolver handles the business logic for a query or mutation,
// including database access via Sequelize and cache management via Redis.

const { Op } = require('sequelize');
const Character = require('../models/Character');
const Comment = require('../models/Comment');
const Favorite = require('../models/Favorite');
const redisClient = require('../config/redis');

const resolvers = {

  // ─── QUERIES ────────────────────────────────────────────────────────────────

  // Returns a filtered and sorted list of characters.
  // Results are cached in Redis for 5 minutes to reduce database load.
  characters: async ({ name, status, species, gender, origin, sortBy }) => {

    // Build a unique cache key based on the applied filters
    const cacheKey = `rym:characters:${JSON.stringify({ name, status, species, gender, origin, sortBy })}`;

    // Check Redis cache first — return cached result if available
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('📦 Datos desde caché Redis');
        return JSON.parse(cached);
      }
    } catch (e) {
      // Redis is optional — continue with database query if cache fails
    }

    // Build Sequelize filter conditions dynamically based on provided arguments
    const where = { is_deleted: false }; // Always exclude soft-deleted characters
    if (name) where.name = { [Op.like]: `%${name}%` };       // Partial name match
    if (status) where.status = status;                         // Exact status match
    if (species) where.species = { [Op.like]: `%${species}%` }; // Partial species match
    if (gender) where.gender = gender;                         // Exact gender match
    if (origin) where.origin = { [Op.like]: `%${origin}%` };  // Partial origin match

    // Determine sort order — defaults to ascending (A-Z)
    const order = sortBy === 'Z-A' ? [['name', 'DESC']] : [['name', 'ASC']];

    // Fetch characters from MySQL
    const characters = await Character.findAll({ where, order });

    // Load all favorites to check isFavorite status efficiently in one query
    const favorites = await Favorite.findAll();
    const favIds = new Set(favorites.map(f => f.character_id));

    // Enrich each character with its comments and favorite status
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

    // Cache the result in Redis for 5 minutes (300 seconds)
    try {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
    } catch (e) {
      // Cache failure is non-critical — result is still returned
    }

    return result;
  },

  // Returns a single character by ID with full details.
  character: async ({ id }) => {
    const c = await Character.findByPk(id);
    if (!c) return null;

    // Load comments and favorite status for the requested character
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

  // ─── MUTATIONS ──────────────────────────────────────────────────────────────

  // Adds a comment to a character.
  // Invalidates all character-related cache entries after inserting.
  addComment: async ({ character_id, author, content }) => {
    const comment = await Comment.create({
      character_id,
      author: author || 'Anonymous', // Default author if not provided
      content
    });

    // Invalidate Redis cache so updated comments appear immediately
    try {
      const keys = await redisClient.keys('rym:characters:*');
      if (keys.length) await redisClient.del(keys);
    } catch (e) {}

    return { ...comment.toJSON(), createdAt: comment.createdAt?.toISOString() };
  },

  // Toggles the favorite status of a character.
  // If already favorited, removes it. If not, adds it.
  toggleFavorite: async ({ character_id }) => {
    const existing = await Favorite.findOne({ where: { character_id } });
    if (existing) {
      await existing.destroy(); // Remove from favorites
      return false;
    }
    await Favorite.create({ character_id }); // Add to favorites
    return true;
  },

  // Soft-deletes a character by setting is_deleted to true.
  // The record remains in the database for data integrity purposes.
  softDeleteCharacter: async ({ id }) => {
    await Character.update({ is_deleted: true }, { where: { id } });

    // Invalidate Redis cache so the deleted character disappears from results
    try {
      const keys = await redisClient.keys('rym:characters:*');
      if (keys.length) await redisClient.del(keys);
    } catch (e) {}

    return true;
  }
};

module.exports = resolvers;