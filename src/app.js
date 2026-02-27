import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
// For frontend later on
import cors from 'cors'
import dotenv from 'dotenv'
// GraphQL schemas
import { typeDefs } from './schema/typeDefs.js'
// Function that actually detches the data
import { resolvers } from './resolvers/index.js'

dotenv.config()

const app = express()

app.use(cors()) // Allows cross origin requests
app.use(express.json()) // Allows JSON in req body


const server = new ApolloServer({
  typeDefs, // What data exists
  resolvers, // How to fetch this data
})

await server.start()


app.use('/graphql', expressMiddleware(server))

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`)
})