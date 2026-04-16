const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');

jest.mock('../config/redis', () => ({
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
  keys: jest.fn().mockResolvedValue([])
}));

const app = express();
app.use(express.json());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: false
}));

describe('Character search query', () => {
  it('returns characters from database', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters { id name status species } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.characters.length).toBeGreaterThan(0);
  });

  it('filters characters by status Alive', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters(status: "Alive") { id name status } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.characters.every(c => c.status === 'Alive')).toBe(true);
  });

  it('filters characters by status Dead', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters(status: "Dead") { id name status } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.characters.every(c => c.status === 'Dead')).toBe(true);
  });

  it('filters characters by species Human', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters(species: "Human") { id name species } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.characters.every(c => c.species === 'Human')).toBe(true);
  });

  it('filters characters by gender Female', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters(gender: "Female") { id name gender } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.characters.every(c => c.gender === 'Female')).toBe(true);
  });

  it('filters characters by name Rick', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters(name: "Rick") { id name } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.characters.every(c => c.name.toLowerCase().includes('rick'))).toBe(true);
  });

  it('returns characters sorted A-Z', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters(sortBy: "A-Z") { id name } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    const names = res.body.data.characters.map(c => c.name);
    expect(names).toEqual([...names].sort());
  });

  it('returns characters sorted Z-A', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters(sortBy: "Z-A") { id name } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    const names = res.body.data.characters.map(c => c.name);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  it('returns empty array when no characters match', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: '{ characters(name: "XYZNonExistentCharacter") { id name } }' });
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.characters).toHaveLength(0);
  });
});

afterAll(async () => {
  const sequelize = require('../config/sequelizeInstance');
  await sequelize.close();
});
