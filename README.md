# Rick and Morty App

Full stack application to search and manage characters from the Rick and Morty series. Built with React 18, GraphQL, Express, MySQL, and Redis.

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Apollo Client (GraphQL)
- React Router DOM
- TailwindCSS

**Backend**
- Node.js + Express
- GraphQL (express-graphql)
- Sequelize ORM + MySQL
- Redis (cache)
- node-cron (scheduled jobs)

---

## Requirements

- Node.js v20+
- MySQL 8+
- Redis (via WSL or Docker)
- Git

---

## Database Setup

1. Open MySQL Workbench and connect to your local server.
2. Run the following command to create the database:

```sql
CREATE DATABASE rickandmorty_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/darwinzamir/rick-and-morty-app.git
cd rick-and-morty-app
```

### 2. Backend setup

```bash
cd rick-and-morty-api
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rickandmorty_db
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=4000
```

Run migrations and seed the database with 15 characters:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 3. Frontend setup

```bash
cd ../rick-and-morty-client
npm install
```

---

## Running the Application

### Step 1 — Start Redis (WSL)

Open Ubuntu from the Start menu and run:

```bash
sudo service redis-server start
redis-cli ping
# Expected response: PONG
```

### Step 2 — Start the backend

Open a terminal inside `rick-and-morty-api`:

```bash
npm run dev
```

The API will be available at: `http://localhost:4000/graphql`

### Step 3 — Start the frontend

Open a second terminal inside `rick-and-morty-client`:

```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

---

## Using the API

The API uses GraphQL. You can explore it interactively using the built-in GraphiQL interface at:

```
http://localhost:4000/graphql
```

### Queries

#### Get all characters

```graphql
{
  characters {
    id
    name
    status
    species
    gender
    image
    isFavorite
  }
}
```

#### Filter characters

```graphql
{
  characters(
    name: "Rick"
    status: "Alive"
    species: "Human"
    gender: "Male"
    sortBy: "A-Z"
  ) {
    id
    name
    status
    species
  }
}
```

Available filter values:
- `status`: `Alive`, `Dead`, `unknown`
- `gender`: `Male`, `Female`, `Genderless`, `unknown`
- `sortBy`: `A-Z`, `Z-A`

#### Get a single character

```graphql
{
  character(id: 1) {
    id
    name
    status
    species
    type
    gender
    origin
    location
    image
    isFavorite
    comments {
      id
      author
      content
      createdAt
    }
  }
}
```

### Mutations

#### Add a comment

```graphql
mutation {
  addComment(
    character_id: 1
    author: "John"
    content: "Rick is the smartest being in the universe!"
  ) {
    id
    author
    content
    createdAt
  }
}
```

#### Toggle favorite

```graphql
mutation {
  toggleFavorite(character_id: 1)
}
```

Returns `true` if marked as favorite, `false` if removed.

#### Soft delete a character

```graphql
mutation {
  softDeleteCharacter(id: 1)
}
```

The character is not permanently deleted — it is hidden from results via the `is_deleted` flag.

---
## API Documentation

Two documentation interfaces are available when the backend is running:

| Interface | URL | Description |
|---|---|---|
| Swagger UI | http://localhost:4000/api-docs | Full API documentation with examples |
| GraphiQL | http://localhost:4000/graphql | Interactive GraphQL explorer |

## Running Tests

### Frontend tests

```bash
cd rick-and-morty-client
npm test
```

Runs 17 unit tests across 3 components: `Filters`, `CharacterCard`, and `DetailPage`.

### Backend tests

```bash
cd rick-and-morty-api
npm test
```

Runs 9 unit tests for the character search query with filters for status, species, gender, name, and sorting.

---

## Features

- List characters with image, name, species, and status
- Sort characters A→Z or Z→A
- Filter by status, species, and gender
- Search by name
- View character details
- Mark characters as favorites
- Add comments to characters
- Soft-delete characters
- Redis cache for search results (5 minutes TTL)
- Automatic cache invalidation on mutations
- Request logging middleware
- Cron job that updates characters every 12 hours

---

## ERD

See [ERD.md](./ERD.md) for the database diagram.

---

## Repository

[https://github.com/darwinzamir/rick-and-morty-app](https://github.com/darwinzamir/rick-and-morty-app)