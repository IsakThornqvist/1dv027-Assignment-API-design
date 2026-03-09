# Assignment API Design - Pokémon API

## Project Setup Commands

### Install Dependencies
```bash
npm install
```

---

## Docker Commands

### Start Docker (run in background)
```bash
docker compose up -d
```

### Start Docker (with rebuild - use after code changes)
```bash
docker compose up --build
```

### Stop Docker (keeps your data)
```bash
docker compose down
```

### Stop Docker and delete all data (clean slate)
```bash
docker compose down -v
```

### Check if Docker is running
```bash
docker compose ps
```

---

## Prisma Commands

### Initialize Prisma (first time only)
```bash
npx prisma init
```

### Run migrations (after changing schema.prisma)
```bash
npx prisma migrate dev --name describe_your_change
```

### Examples of migrations
```bash
npx prisma migrate dev --name init
npx prisma migrate dev --name add_test
npx prisma migrate dev --name remove_test
npx prisma migrate dev --name remove_teams_users
```

### Seed the database (import CSV data)
```bash
npx prisma db seed
```
or
```bash
node prisma/seed.js
```

### Open Prisma Studio (visual database browser)
```bash
npx prisma studio
```
Opens at http://localhost:5555

### Regenerate Prisma Client (after schema changes)
```bash
npx prisma generate
```

---

## How to Add a New Table

1. Add a new model in `prisma/schema.prisma`:
```prisma
model Example {
  id      Int    @id @default(autoincrement())
  name    String
}
```

2. Run migration:
```bash
npx prisma migrate dev --name add_example
```

3. Verify in Prisma Studio:
```bash
npx prisma studio
```

---

## How to Remove a Table

1. Delete the model from `prisma/schema.prisma`

2. Run migration:
```bash
npx prisma migrate dev --name remove_example
```

---

## How to Add a Column to Existing Table

1. Add the field to the model in `prisma/schema.prisma`:
```prisma
model Pokemon {
  ...
  newField String?
}
```

2. Run migration:
```bash
npx prisma migrate dev --name add_newfield_to_pokemon
```

---

## Daily Workflow

```bash
# 1. Open Docker Desktop
# 2. Start containers
docker compose up -d

# 3. Start development server
npm run dev

# 4. Open database browser (optional)
npx prisma studio
```

---

## NPM Scripts

| Command | What it does |
|---|---|
| `npm run start` | Start the server |
| `npm run dev` | Start with auto-reload on save |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

---

## Connect to Database via Terminal

```bash
docker exec -it assignment-api-design-db-1 psql -U postgres -d pokemondb
```

Useful SQL commands inside psql:
```sql
\dt                          -- list all tables
SELECT * FROM "Pokemon" LIMIT 10;
\q                           -- exit
```

---

## Git Commands

### Push changes to GitLab
```bash
git add .
git commit -m "your message"
git push
```

# Mutation
mutation {
  register(email: "test@example.com", password: "??????") {
    token
    user {
      id
      email
    }
  }
}