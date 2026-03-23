import prisma from "../prisma.js"


export const pokemonResolver = {
  Query: {
    pokemonById: async (_, { id }) => {
      return prisma.pokemon.findUnique({
        where: { id: parseInt(id) }
      })
    },
    allPokemon: async (_, { limit, offset }) => {
      return prisma.pokemon.findMany({
      take: limit || 100,
      skip: offset || 0
     })
    },
    pokemonByType: async (_, { type1 }) => {
      return prisma.pokemon.findMany({
        where: {
          type1: {
            equals: type1,
            mode: "insensitive"
          }
        }
      })
    },
    searchPokemon: async(_, { name }) => {
      return prisma.pokemon.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive"
          }
        }
      })
    },

  },


}