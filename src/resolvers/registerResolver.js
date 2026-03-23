import prisma from "../prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { GraphQLError } from 'graphql'


export const registerResolver = {
  Mutation: {
    // Email and password is what users sent in
    register: async (_, { email, password }) => {
      if (!password || !email) {
        throw new GraphQLError("Email and password are needed!", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 }}
        })
      }
      if (password.length < 5) {
        throw new GraphQLError("Password need to be longer than 5 characters!", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 }}
        })
      }
      // Check for duplicates in the database
      const emailAlreadyExists = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (emailAlreadyExists) {
        throw new GraphQLError("User already exists in database!", {
          extensions: { code: "BAD_USER_INPUT", http: { status: 400 }}
        })
      }

      const passwordHashed = await bcrypt.hash(password, 10)

      // Save the user to the database
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHashed,
        },
      })

      // Create token, payload is { userId: 1 }, signs with secret key
      const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      })

      return {
        token: jwtToken,
        user: user,
      }
    },
  },

  Query: {
    allUsers: async () => {
      return await prisma.user.findMany()
    },
  },
}
