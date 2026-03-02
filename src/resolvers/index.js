import prisma from "../prisma.js"

export const resolvers = {
  Query: {
    hello: () => 'Apollo is working yay!',

    pokemon: async (_, { id }) => {
      return prisma.pokemon.findUnique({
        where: { id: parseInt(id) }
      })
    },
    allPokemon: async() => {
      return await prisma.pokemon.findMany()
    }
  }
}