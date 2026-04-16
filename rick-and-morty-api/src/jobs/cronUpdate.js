// Cron job that automatically updates the character database every 12 hours.
// Fetches the first 15 characters from the public Rick and Morty API
// and upserts them into the local database (insert or update if already exists).

const cron = require('node-cron');
const axios = require('axios');
const Character = require('../models/Character');

const startCronJob = () => {

  // Schedule the job to run at minute 0 of every 12th hour (00:00 and 12:00)
  cron.schedule('0 */12 * * *', async () => {
    console.log(`[CRON] Iniciando actualización: ${new Date().toISOString()}`);

    try {
      // Fetch the first page of characters from the public Rick and Morty API
      const { data } = await axios.get('https://rickandmortyapi.com/api/character?page=1');
      const characters = data.results.slice(0, 15);

      // Upsert each character — update if exists, insert if not
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
          is_deleted: false // Restore soft-deleted characters on update
        });
      }

      console.log(`[CRON] Actualización completada: ${new Date().toISOString()}`);
    } catch (err) {
      // Log the error but do not crash the server
      console.error('[CRON] Error:', err.message);
    }
  });

  console.log('[CRON] Job programado cada 12 horas');
};

module.exports = startCronJob;