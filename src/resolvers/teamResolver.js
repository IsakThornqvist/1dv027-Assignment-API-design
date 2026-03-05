import prisma from "../prisma.js"
import jwt from "jsonwebtoken"

export const teamResolver = {
  Mutation: {
    createTeam: async (_, { name }, context) => {
      if (!context.userId) {
        throw new Error("No authenticaition!")
      }

      return prisma.team.create({
        data: {
          name,
          userId: context.userId,
        },
        include: {
          user: true,
          members: {
            include: {
              pokemon: true,
            },
          },
        },
      })
    },

    addPokemonToTeam: async (_, { teamId, pokemonId }, context) => {
      if (!context.userId) {
        throw new Error("No authenticaition!")
      }

      const team = await prisma.team.findUnique({
        where: { id: parseInt(teamId) },
        include: {
          members: true,
        },
      })

      if (!team) {
        throw new Error("Team does not exist!")
      }

      if (team.userId !== context.userId) {
        throw new Error("Team does not exist!")
      }

      const pokemon = await prisma.pokemon.findUnique({
        where: { id: parseInt(pokemonId) },
      })
      if (!pokemon) {
        throw new Error("Pokemon does not exist!")
      }

      if (team.members.length >= 6) {
        throw new Error("Max teamsize is 6!")
      }

      return prisma.team.update({
        where: {
          id: parseInt(teamId),
        },
        data: {
          members: {
            create: { pokemonId: parseInt(pokemonId) },
          },
        },
        include: {
          user: true,
          members: {
            include: {
              pokemon: true,
            },
          },
        },
      })
    },
  },

  Query: {},
}
