import prisma from "../prisma.js"
import { checkAuth } from "../validations/teamValidations.js"
import { getTeamAndVerifyOwnership } from "../validations/teamValidations.js"

export const teamResolver = {
  Mutation: {
    createTeam: async (_, { name }, context) => {
      // contect = { userId: 1 } - comes from jwt in server
      // the user does not need to send their userId, dont trust the client for this
        checkAuth(context)

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
      checkAuth(context)
      // Get the team, include members is used to check length
      const team = await getTeamAndVerifyOwnership(teamId, context.userId)
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

    updateTeam: async (_, { teamId, name }, context) => {
      checkAuth(context)
      // Get the team, include members is used to check length
      const team = await getTeamAndVerifyOwnership(teamId, context.userId)

      const updatedTeam = await prisma.team.update({
        where: { id: parseInt(teamId) },
        data: { name },
        include: {
          user: true,
          members: {
            include: {
              pokemon: true,
            },
          },
        },
      })
      return updatedTeam
    },

    removePokemonFromTeam: async (_, { teamId, pokemonId }, context) => {
      checkAuth(context)
      // Get the team, include members is used to check length
      const team = await getTeamAndVerifyOwnership(teamId, context.userId)
      // Make sure the pokemon is in the database
      const pokemon = await prisma.pokemon.findUnique({
        where: { id: parseInt(pokemonId) },
      })
      if (!pokemon) {
        throw new Error("Pokemon does not exist!")
      }

      await prisma.teamMember.deleteMany({
        where: {
          teamId: parseInt(teamId),
          pokemonId: parseInt(pokemonId),
        },
      })

      return prisma.team.findUnique({
        where: {
          id: parseInt(teamId),
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

  Query: {
    allTeams: async() => {
        return await prisma.team.findMany()
    },

  },
}
