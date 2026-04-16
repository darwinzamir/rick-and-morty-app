const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rick and Morty API',
      version: '1.0.0',
      description: `
Full stack API for searching and managing characters from the Rick and Morty series.

## GraphQL Endpoint
All GraphQL queries and mutations are sent as **POST** requests to \`/graphql\`.

## GraphiQL Interface
Interactive GraphQL explorer available at [/graphql](/graphql)
      `,
      contact: {
        name: 'Darwin Zamir',
        url: 'https://github.com/darwinzamir/rick-and-morty-app'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local development server'
      }
    ],
    components: {
      schemas: {
        Character: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Rick Sanchez' },
            status: { type: 'string', enum: ['Alive', 'Dead', 'unknown'], example: 'Alive' },
            species: { type: 'string', example: 'Human' },
            type: { type: 'string', example: '' },
            gender: { type: 'string', enum: ['Female', 'Male', 'Genderless', 'unknown'], example: 'Male' },
            origin: { type: 'string', example: 'Earth (C-137)' },
            location: { type: 'string', example: 'Citadel of Ricks' },
            image: { type: 'string', example: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' },
            is_deleted: { type: 'boolean', example: false },
            isFavorite: { type: 'boolean', example: false },
            comments: {
              type: 'array',
              items: { '$ref': '#/components/schemas/Comment' }
            }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            character_id: { type: 'integer', example: 1 },
            author: { type: 'string', example: 'John' },
            content: { type: 'string', example: 'Rick is the smartest being in the universe!' },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' }
          }
        },
        GraphQLRequest: {
          type: 'object',
          required: ['query'],
          properties: {
            query: { type: 'string', description: 'GraphQL query or mutation' },
            variables: { type: 'object', description: 'GraphQL variables (optional)' }
          }
        },
        GraphQLResponse: {
          type: 'object',
          properties: {
            data: { type: 'object', description: 'Response data' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            service: { type: 'string', example: 'Rick & Morty API' }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          description: 'Returns the status of the API server.',
          responses: {
            200: {
              description: 'Server is running',
              content: {
                'application/json': {
                  schema: { '$ref': '#/components/schemas/HealthResponse' }
                }
              }
            }
          }
        }
      },
      '/graphql': {
        post: {
          tags: ['GraphQL'],
          summary: 'GraphQL endpoint',
          description: 'Main GraphQL endpoint. Send queries and mutations here.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { '$ref': '#/components/schemas/GraphQLRequest' }
              }
            }
          },
          responses: {
            200: {
              description: 'Successful GraphQL response',
              content: {
                'application/json': {
                  schema: { '$ref': '#/components/schemas/GraphQLResponse' }
                }
              }
            }
          }
        }
      },
      '/graphql#query-characters': {
        post: {
          tags: ['Characters — Queries'],
          summary: 'Get all characters',
          description: 'Returns a list of characters. Supports filtering by name, status, species, gender, origin and sorting.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      example: '{ characters(name: "Rick", status: "Alive", species: "Human", gender: "Male", sortBy: "A-Z") { id name status species gender image isFavorite } }'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'List of characters',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          characters: {
                            type: 'array',
                            items: { '$ref': '#/components/schemas/Character' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/graphql#query-character': {
        post: {
          tags: ['Characters — Queries'],
          summary: 'Get character by ID',
          description: 'Returns a single character with full details including comments and favorite status.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      example: '{ character(id: 1) { id name status species type gender origin location image isFavorite comments { id author content createdAt } } }'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Character details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          character: { '$ref': '#/components/schemas/Character' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/graphql#mutation-addComment': {
        post: {
          tags: ['Characters — Mutations'],
          summary: 'Add a comment to a character',
          description: 'Adds a new comment to a character. Author is optional and defaults to "Anonymous".',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      example: 'mutation { addComment(character_id: 1, author: "John", content: "Rick is amazing!") { id author content createdAt } }'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Comment created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          addComment: { '$ref': '#/components/schemas/Comment' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/graphql#mutation-toggleFavorite': {
        post: {
          tags: ['Characters — Mutations'],
          summary: 'Toggle character favorite',
          description: 'Marks or unmarks a character as favorite. Returns true if marked, false if unmarked.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      example: 'mutation { toggleFavorite(character_id: 1) }'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Favorite toggled',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          toggleFavorite: { type: 'boolean', example: true }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/graphql#mutation-softDelete': {
        post: {
          tags: ['Characters — Mutations'],
          summary: 'Soft delete a character',
          description: 'Marks a character as deleted without removing it from the database. The character will no longer appear in queries.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    query: {
                      type: 'string',
                      example: 'mutation { softDeleteCharacter(id: 1) }'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Character soft deleted',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          softDeleteCharacter: { type: 'boolean', example: true }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;