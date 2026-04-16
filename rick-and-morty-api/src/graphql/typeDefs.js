const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Character {
    id: Int
    name: String
    status: String
    species: String
    type: String
    gender: String
    origin: String
    location: String
    image: String
    is_deleted: Boolean
    comments: [Comment]
    isFavorite: Boolean
  }

  type Comment {
    id: Int
    character_id: Int
    author: String
    content: String
    createdAt: String
  }

  type Query {
    characters(
      name: String
      status: String
      species: String
      gender: String
      origin: String
      sortBy: String
    ): [Character]

    character(id: Int!): Character
  }

  type Mutation {
    addComment(character_id: Int!, author: String, content: String!): Comment
    toggleFavorite(character_id: Int!): Boolean
    softDeleteCharacter(id: Int!): Boolean
  }
`);

module.exports = schema;