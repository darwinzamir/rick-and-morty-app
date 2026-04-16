const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379
  }
});

client.on('error', err => console.error('Redis error:', err));
client.on('connect', () => console.log('✅ Redis conectado'));

client.connect().catch(console.error);

module.exports = client;