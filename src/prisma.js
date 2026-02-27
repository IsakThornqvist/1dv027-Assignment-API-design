import { PrismaClient } from '@prisma/client'

// Connection to the postgreSQL database (Singleton)
const prisma = new PrismaClient()

export default prisma