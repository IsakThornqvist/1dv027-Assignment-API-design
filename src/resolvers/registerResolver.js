import prisma from "../prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerResolver = {

  Mutation: {
    register : async(_, { email, password}) => {
        if (!password || !email) {
            throw new Error('Email and password are needed!')
        }
        if (password.length < 5) {
            throw new Error('Password need to be longer than 5 characters!')
        } 

        const emailAlreadyExists = await prisma.user.findUnique({
            where: { 
                email 
            },
        })

        if (emailAlreadyExists) {
            throw new Error('User already exists in database!')
        }

        const passwordHashed = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: passwordHashed,
            },
        })

        const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        return {
            token: jwtToken,
            user: user,
            }
        }
    },


    Query: {
        allUsers: async() => {
            return await prisma.user.findMany()
        },
    }
}