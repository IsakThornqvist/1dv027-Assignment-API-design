import prisma from "../prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const loginResolver = {
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if (!user) {
        throw new Error("User does not exist!")
      }
      const validPasswordMatch = await bcrypt.compare(password, user.password)
      if (!validPasswordMatch) {
        throw new Error("Password does not match!")
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
