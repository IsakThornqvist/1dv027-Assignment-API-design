import prisma from "../prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { GraphQLError } from 'graphql'


export const loginResolver = {
  Mutation: {
    login: async (_, { email, password }) => {
        // Find the user
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if (!user) {
        throw new GraphQLError("User does not exist!", {
          extensions: { code: "NOT_FOUND", http: { status: 404 }}
        })
      }
      // bcrypt.compare hashes and compares to the saved password
      const validPasswordMatch = await bcrypt.compare(password, user.password)
      if (!validPasswordMatch) {
        throw new GraphQLError("Password does not match!", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 }}
        })
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      })

      return {
        token,
        user,
      }
    },
  },

  Query: {},
}
