'use strict';
const axios = require('axios');

module.exports = {
  up: async (queryInterface) => {
    const { data } = await axios.get('https://rickandmortyapi.com/api/character?page=1');
    const characters = data.results.slice(0, 15).map(c => ({
      id: c.id,
      name: c.name,
      status: c.status,
      species: c.species,
      type: c.type || '',
      gender: c.gender,
      origin: c.origin.name,
      location: c.location.name,
      image: c.image,
      is_deleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('characters', characters, {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('characters', null, {});
  }
};