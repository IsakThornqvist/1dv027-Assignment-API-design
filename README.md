# API Design Assignment

## Project Name

**Pokemon Team Builder API**

## Objective
The Pokemon Team Builder API is a GraphQL API that allows users to explore Pokémon data and build custom teams. It uses a dataset containing over a thousand Pokémon with detailed stats, types, and abilities.

The API includes three main resources: Pokemon (read-only), User, and Team (full CRUD). Users can register and log in using JWT authentication, then create and manage teams by adding or removing Pokémon. The API demonstrates key concepts such as single-endpoint GraphQL design, nested queries, and secure, stateless authentication.


## GraphQL

| | URL / File |
|---|---|
| **Production API/API Documentation** | *https://1dv027-assignment-api-design-production.up.railway.app/graphql* |
| **GraphQL Playground** | *https://1dv027-assignment-api-design-production.up.railway.app/graphql* |
| **Postman Collection** | `pokemon-api.postman_collection.json` |
| **Production Environment** | `production.postman_environment.json` |

**Run tests in the following way:**

1. **Run manually in terminal** — no setup needed:
- Clone the repository and run:
   ```
   npx newman run tests/pokemon-api.postman_collection.json -e tests/production.postman_environment.json
   ```

## Dataset

*Describe the dataset you chose:*


| Field | Description |
|---|---|
| **Dataset source** | Kaggle, Dataset of 32000 Pokemon Images & CSV, JSON https://www.kaggle.com/datasets/divyanshusingh369/complete-pokemon-library-32k-images-and-csv/data |
| **Primary resource (CRUD)** | Team (id, name, user_id, user, memebers, createdAt) |
| **Secondary resource 1 (read-only)** | Pokemon (id, name, etc) |
| **Secondary resource 2 (read-only)** | User (id, email, teams) |


## Design Decisions

### Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. When a user registers via the `register` mutation, the server returns a signed JWT token. This token must be included in the `Authorization` header as `Bearer <token>` for all write operations (creating, updating, and deleting teams). Read-only operations such as querying Pokemon are public and require no authentication.

The token is signed with a secret key (`JWT_SECRET`) stored as an environment variable and expires after 7 days. On each protected request, the server decodes the token in the context function and attaches the `userId` to the context object. The resolvers then use this to verify identity and ownership without trusting user-supplied IDs.

**Why JWT?**

JWT is stateless so the server does not need to store sessions in the database. This makes it simple to scale and works well with GraphQL's single-endpoint approach.

**Alternatives and trade-offs:**

| Approach | Trade-offs |
|---|---|
| **Session-based auth** | Server stores sessions in DB leads to more control but harder to scale |
| **OAuth2** | Delegate auth to a third party such as Google or GitHub which is easier for users but more complex to implement |
| **API Keys** | Simple but no expiry or user identity so it is better suited for server-to-server communication |

### API Design

**Schema Design**

The schema was designed around three core resources: `Pokemon`, `User`, and `Team`, connected through a `TeamMember` join table.

- `Pokemon` is a read-only resource seeded from a CSV dataset containing 1215 pokemon with stats, types, and abilities.
- `User` stores authenticated users with a hashed password and owns one or many teams.
- `Team` is the primary CRUD resource — it belongs to a user and contains up to 6 pokemon via the `TeamMember` join table.
- `TeamMember` acts as the bridge between `Team` and `Pokemon`, allowing many pokemon to belong to many teams.

The GraphQL schema uses this structure with three main types, `Pokemon`, `User`, and `Team` along with a `TeamMember` type and an `AuthPayload` type for authentication responses.

Queries cover read operations: `allPokemon`, `pokemonById`, `pokemonByType`, `searchPokemon`, `myTeams`, and `teamById`. Mutations cover authentication (`register`, `login`) and full CRUD for teams (`createTeam`, `updateTeam`, `deleteTeam`, `addPokemonToTeam`, `removePokemonFromTeam`).

# Flow for creating a new user and making a new team

## 1️⃣ Register a new User
```graphql
mutation {
  register(email: "testing@example.com", password: "pw123456") {
    token
    user {
      id
      email
    }
  }
}
```

**Save the returned JWT token, it will be needed for all protected operations**

## 2️⃣ Login user
```graphql
## (Optional) Login existing user
mutation {
  login(email: "testing@example.com", password: "pw123456") {
    token
    user {
      id
      email
    }
  }
}
```


## 3️⃣ Authenticate requests

**Include the token in your headers**

```graphql
Authorization: Bearer <your_token>
```

## 4️⃣ Search for Pokemon
**Example: Find Pokémon by name**
```graphql
query {
  searchPokemon(name: "charizard") {
    id
    name
    type1
    hp
  }
}
```

**Or filter by type:**
```graphql
query {
  pokemonByType(type1: "Fire") {
    id
    name
  }
}
```

## 5️⃣ Create a new team
```graphql
mutation {
  createTeam(name: "My First Team") {
    id
    name
  }
}
```
**(Requires authentication via Bearer token in the Authorization header)**

##  6️⃣ Add Pokémon to the team
```graphql
mutation {
  addPokemonToTeam(teamId: "TEAM_ID", pokemonId: "POKEMON_ID") {
    id
    members {
      pokemon {
        name
      }
    }
  }
}
```

**(You can repeat this step until your team has up to 6 Pokémon.)**

##  7️⃣ View your team (nested query)

An example of a nested queries is `teamById` which is a single query that returns the full team with nested members and their pokemon:
```graphql
query {
  teamById(teamId: "TEAM_ID") {
    id
    name
    user {
      email
    }
    members {
      pokemon {
        name
        type1
        hp
      }
    }
  }
}
```

**(This allows the client to fetch a complete team with all pokemon data in a single request. This is something that would require multiple REST endpoints.)**

## 8️⃣ Update team name (optional)
```graphql
mutation {
  updateTeam(teamId: "TEAM_ID", name: "Updated Team Name") {
    id
    name
  }
}
```

## 9️⃣ Remove a Pokémon (optional)
```graphql
mutation {
  removePokemonFromTeam(teamId: "TEAM_ID", pokemonId: "POKEMON_ID") {
    id
  }
}
```

## 🔟 Delete a team (optional)
```graphql
mutation {
  deleteTeam(teamId: "TEAM_ID") {
    id
    name
  }
}
```

## 1️⃣1️⃣ View all your teams
```graphql
query {
  myTeams {
    id
    name
    members {
      pokemon {
        name
      }
    }
  }
}
```



**Single Endpoint**

All queries and mutations go through `/graphql`. This simplifies the API as there. The client decides exactly what data it needs and the server returns precisely that, avoiding over-fetching or under-fetching data that is not needed.

### Error Handling

My approach to error handling was to always check for errors first in my resolvers before any database operations run, to make sure errors are caught early and consistently.

For simple checks such as validating that a user exists or that a pokemon is not already on a team, I use `throw GraphQLError()` with a descriptive message. For repeated authorization checks I created a `validations` folder containing `teamValidation.js` which exports two reusable functions:

- `checkAuth(context)` — throws if no valid JWT token is present
- `getTeamAndVerifyOwnership(teamId, userId)` — fetches the team, throws if it does not exist or belongs to a different user

These are imported and called at the top of every resolver that needs this protection:
```javascript
checkAuth(context)
const team = await getTeamAndVerifyOwnership(teamId, context.userId)
```

All errors follow GraphQL's standard error format:
```json
{
  "errors": [
    {
      "message": "Team does not exist!",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ],
  "data": null
}
```

## Core Technologies Used

| Technology | Why |
|---|---|
| **Node.js** | JavaScript runtime for building the server |
| **Apollo Server** | Industry standard GraphQL server, provides built-in playground and schema validation |
| **Express** | Minimal web framework used alongside Apollo Server for middleware support |
| **GraphQL** | Single endpoint, client decides what data it needs, it works well for a API |
| **Prisma** | Type-safe ORM that simplifies database queries and relation handling, especially for nested data |
| **PostgreSQL** | Reliable relational database that fits well with the relational nature of teams, users and pokemon |
| **JWT (jsonwebtoken)** | Stateless authentication with no session storage needed, works well with GraphQL |
| **bcryptjs** | Secure password hashing before storing in the database to protect the users |
| **Railway** | Simple cloud deployment platform with built-in PostgreSQL support |
| **Newman** | CLI runner for Postman collections, used for automated testing |
| **Docker** | Containerizes the application for consistent environments across local and production |

## Reflection

The hardest part was learning new syntax and concepts simultaneously. I chose to use Prisma as my ORM despite being unfamiliar with it. At first it felt more complicated than writing raw SQL queries, but I decided to stick with it because I wanted to learn it properly. In hindsight I do not regret that decision. Once I understood how `include` works for relations and how `where`, `data` and `upsert` fit together, it became very intuitive.

GraphQL was completely new to me this time around and I am really happy to have gotten to work with it. The biggest difference between GraphQL and REST, which I am more familiar with, is that GraphQL uses a single endpoint and lets the client decide exactly what data it needs. In REST you design multiple endpoints and the server decides what to return. This can lead to over-fetching or under-fetching data. With GraphQL I only return what is asked for, which feels clean.

Deploying with Railway and setting up Docker was also a new challenge. Getting environment variables, migrations and seeding to work correctly in a production environment took more time than expected.

**What I would do differently:**
- Add pagination to all list queries from the start instead of as an afterthought
- Set up CI/CD early in the process so tests run automatically from the beginning
- Batch the seed script to insert multiple records at once instead of one at a time since seeding 1200+ pokemon individually over a remote connection was very slow
- Use Test Driven Development instead of making all the tests later when most of the code already was done


## Requirements

### Functional Requirements — Common

| Requirement | Issue | Status |
|---|---|---|
| Data acquisition — choose and document a dataset (1000+ data points) | [#1](../../issues/1) | :white_check_mark: |
| Full CRUD for primary resource, read-only for secondary resources | [#2](../../issues/2) | :white_check_mark: |
| JWT authentication for write operations | [#3](../../issues/3) | :white_check_mark: |
| Error handling (400, 401, 404 with consistent format) | [#4](../../issues/4) | :white_check_mark: |
| Filtering and pagination for large result sets | [#17](../../issues/17) | :white_check_mark: |


### Functional Requirements — GraphQL

| Requirement | Issue | Status |
|---|---|---|
| Queries and mutations via single `/graphql` endpoint | [#14](../../issues/14) | :white_check_mark: |
| At least one nested query | [#15](../../issues/15) | :white_check_mark: |
| GraphQL Playground available | [#16](../../issues/16) | :white_check_mark: |

### Non-Functional Requirements

| Requirement | Issue | Status |
|---|---|---|
| API documentation (Swagger/OpenAPI or Postman) | [#6](../../issues/6) | :white_check_mark: |
| Automated Postman tests (20+ test cases, success + failure) | [#7](../../issues/7) | :white_check_mark: |
| CI/CD pipeline running tests on every commit/MR | [#8](../../issues/8) | :white_large_square: |
| Seed script for sample data | [#5](../../issues/5) | :white_check_mark: |
| Code quality (consistent standard, modular, documented) | [#10](../../issues/10) | :white_check_mark: |
| Deployed and publicly accessible | [#9](../../issues/9) | :white_check_mark: |
| Peer review reflection submitted on merge request | [#11](../../issues/11) | :white_large_square: |



