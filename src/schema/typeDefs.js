export const typeDefs = `#graphql

  type Pokemon {
    id: ID!
    name: String!
    type1: String!
    type2: String
    species: String
    height: String
    weight: String
    abilities: String
    hp: Int
    attack: Int
    defense: Int
    spAttack: Int
    spDefense: Int
    speed: Int
    catchRate: Int
    baseExp: Int
    growthRate: String
    eggGroups: String
    gender: String
  }

  type Query {
    hello: String
    pokemon(id: ID!): Pokemon
  }
`