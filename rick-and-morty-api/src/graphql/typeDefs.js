// GraphQL schema definition for the Rick and Morty API.
// Defines the types, queries, and mutations available to clients.

const { buildSchema } = require('graphql');

const schema = buildSchema(`
  # Represents a Rick and Morty character stored in the database
  type Character {
    id: Int
    name: String
    status: String       # Alive | Dead | unknown
    species: String
    type: String
    gender: String       # Female | Male | Genderless | unknown
    origin: String
    location: String
    image: String
    is_deleted: Boolean  # Soft-delete flag — true means hidden from results
    comments: [Comment]  # All comments associated with this character
    isFavorite: Boolean  # Whether the character is marked as favorite
  }

  # Represents a user comment on a character
  type Comment {
    id: Int
    character_id: Int
    author: String
    content: String
    createdAt: String
  }

  # Available queries — read-only operations
  type Query {
    # Returns a filtered and sorted list of characters
    # All parameters are optional — omitting them returns all characters
    characters(
      name: String      # Partial match on character name
      status: String    # Exact match: Alive | Dead | unknown
      species: String   # Partial match on species
      gender: String    # Exact match: Female | Male | Genderless | unknown
      origin: String    # Partial match on origin
      sortBy: String    # A-Z | Z-A (defaults to A-Z)
    ): [Character]

    # Returns a single character by its ID including comments and favorite status
    character(id: Int!): Character
  }

  # Available mutations — write operations
  type Mutation {
    # Adds a comment to a character. Author defaults to "Anonymous" if not provided
    addComment(character_id: Int!, author: String, content: String!): Comment

    # Toggles the favorite status of a character
    # Returns true if now favorite, false if removed from favorites
    toggleFavorite(character_id: Int!): Boolean

    # Soft-deletes a character by setting is_deleted to true
    # The character remains in the database but is excluded from all queries
    softDeleteCharacter(id: Int!): Boolean
  }
`);

module.exports = schema;