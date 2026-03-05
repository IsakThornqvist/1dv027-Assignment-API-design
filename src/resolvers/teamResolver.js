import prisma from "../prisma.js"
import jwt from "jsonwebtoken"

export const teamResolver = {
  Mutation: {
    createTeam: async (_, { name }, context) => {
        // contect = { userId: 1 } - comes from jwt in server
        // the user does not need to send their userId, dont trust the client for this
      if (!context.userId) {
        throw new Error("No authenticaition!")
      }

      return prisma.team.create({
        data: {
          name, // from argument
          userId: context.userId, // from the verified JWT token
        },
        // include is needed because the Team type in typeDefs needs user and members
        // without include Prisma only returns { id, name, userId, createdAt}
        include: {
          user: true,
          members: {
            include: {
              pokemon: true, // members contains a relation to pokemon aswell
            },
          },
        },
      })
    },

    addPokemonToTeam: async (_, { teamId, pokemonId }, context) => {
        // Auth check
      if (!context.userId) {
        throw new Error("No authenticaition!")
      }
      // Get the team, include members is used to check length
      const team = await prisma.team.findUnique({
        where: { id: parseInt(teamId) },
        include: {
          members: true,
        },
      })
      // Make sure the team exists
      if (!team) {
        throw new Error("Team does not exist!")
      }
      // Look at the ownership
      if (team.userId !== context.userId) {
        throw new Error("Team does not exist!")
      }
      // Make sure the pokemon is in the database
      const pokemon = await prisma.pokemon.findUnique({
        where: { id: parseInt(pokemonId) },
      })
      if (!pokemon) {
        throw new Error("Pokemon does not exist!")
      }
      // Check to make sure team length is not to long
      if (team.members.length >= 6) {
        throw new Error("Max teamsize is 6!")
      }
      // Create the TeamMember row and return the updated team
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
