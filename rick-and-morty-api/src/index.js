// Entry point of the Rick and Morty API server.
// Initializes Express, applies middleware, sets up GraphQL and Swagger,
// connects to MySQL via Sequelize, and starts the cron job.

require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const schema = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const logger = require('./middleware/logger');
const sequelize = require('./config/sequelizeInstance');
const startCronJob = require('./jobs/cronUpdate');

const app = express();

// Allow cross-origin requests from the React frontend
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Log relevant information for every incoming request
app.use(logger);

// Swagger UI — interactive API documentation
// Available at: http://localhost:4000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// GraphQL endpoint — handles all queries and mutations
// GraphiQL interface enabled for development exploration
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}));

// Health check endpoint — used to verify the server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Rick & Morty API' });
});

const PORT = process.env.PORT || 4000;

// Authenticate the database connection before starting the server.
// This ensures MySQL is reachable before accepting any requests.
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL conectado');

    // Start the cron job that updates characters every 12 hours
    startCronJob();

    app.listen(PORT, () => {
      console.log(`🚀 API corriendo en http://localhost:${PORT}/graphql`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err);
  });