require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const logger = require('./middleware/logger');
const sequelize = require('./config/sequelizeInstance');
const startCronJob = require('./jobs/cronUpdate');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Rick & Morty API' });
});

const PORT = process.env.PORT || 4000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL conectado');
    startCronJob();
    app.listen(PORT, () => {
      console.log(`🚀 API corriendo en http://localhost:${PORT}/graphql`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err);
  });