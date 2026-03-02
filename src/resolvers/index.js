import { pokemonResolver } from "./pokemonResolver.js"
import { registerResolver } from "./registerResolver.js"

export const resolvers = {
  Query: {
    ...pokemonResolver.Query,
    ...registerResolver.Query
  },

  Mutation: {
    ...registerResolver.Mutation
  },
}