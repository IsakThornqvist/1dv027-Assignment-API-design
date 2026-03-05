import prisma from "../prisma.js";
import jwt from "jsonwebtoken";

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
  },

  Query: {},
};
