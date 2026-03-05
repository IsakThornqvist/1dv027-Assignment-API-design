import { pokemonResolver } from "./pokemonResolver.js"
import { registerResolver } from "./registerResolver.js"
import { loginResolver } from "./loginResolver.js"
import { teamResolver } from "./teamResolver.js"

export const resolvers = {
  Query: {
    ...pokemonResolver.Query,
    ...registerResolver.Query
  },

  Mutation: {
    ...registerResolver.Mutation,
    ...loginResolver.Mutation,
    ...teamResolver.Mutation
  },
}