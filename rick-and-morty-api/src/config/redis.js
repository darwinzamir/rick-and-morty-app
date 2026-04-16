// Redis client configuration.
// Redis is used to cache GraphQL query results and reduce database load.
// If Redis is unavailable, the application continues to work without caching.

const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT) || 6379
  }
});

// Log Redis connection errors without crashing the server
client.on('error', err => console.error('Redis error:', err));

// Confirm successful connection
client.on('connect', () => console.log('✅ Redis conectado'));

// Connect to Redis — errors are caught to allow the app to start without Redis
client.connect().catch(console.error);

module.exports = client;