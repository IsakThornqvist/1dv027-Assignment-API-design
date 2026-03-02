import { pokemonResolver } from "./pokemonResolver.js"

export const resolvers = {
  Query: {
    ...pokemonResolver.Query
  },
}