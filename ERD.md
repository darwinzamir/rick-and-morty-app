# ERD — Rick and Morty Database

Database: `rickandmorty_db`

```mermaid
erDiagram
  characters {
    INT id PK
    VARCHAR name
    ENUM status
    VARCHAR species
    VARCHAR type
    ENUM gender
    VARCHAR origin
    VARCHAR location
    VARCHAR image
    BOOLEAN is_deleted
    DATETIME createdAt
    DATETIME updatedAt
  }
  character_comments {
    INT id PK
    INT character_id FK
    VARCHAR author
    TEXT content
    DATETIME createdAt
    DATETIME updatedAt
  }
  character_favorites {
    INT id PK
    INT character_id FK
    DATETIME createdAt
    DATETIME updatedAt
  }
  characters ||--o{ character_comments : "has"
  characters ||--o| character_favorites : "can be"
```

## Relationships

- A `character` can have zero or many `character_comments` (one-to-many)
- A `character` can have zero or one `character_favorites` (one-to-one)
- When a character is deleted from `characters`, all related comments and favorites are deleted automatically (CASCADE)

## Notes

- `status` values: `Alive`, `Dead`, `unknown`
- `gender` values: `Female`, `Male`, `Genderless`, `unknown`
- `is_deleted` implements soft-delete — records are never physically removed