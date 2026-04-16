const cron = require('node-cron');
const axios = require('axios');
const Character = require('../models/Character');

const startCronJob = () => {
  cron.schedule('0 */12 * * *', async () => {
    console.log(`[CRON] Iniciando actualización: ${new Date().toISOString()}`);
    try {
      const { data } = await axios.get('https://rickandmortyapi.com/api/character?page=1');
      const characters = data.results.slice(0, 15);
      for (const c of characters) {
        await Character.upsert({
          id: c.id,
          name: c.name,
          status: c.status,
          species: c.species,
          type: c.type || '',
          gender: c.gender,
          origin: c.origin.name,
          location: c.location.name,
          image: c.image,
          is_deleted: false
        });
      }
      console.log(`[CRON] Actualización completada: ${new Date().toISOString()}`);
    } catch (err) {
      console.error('[CRON] Error:', err.message);
    }
  });
  console.log('[CRON] Job programado cada 12 horas');
};

module.exports = startCronJob;