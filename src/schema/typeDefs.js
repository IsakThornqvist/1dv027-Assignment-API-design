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
    pokemonById(id: ID!): Pokemon
    allPokemon: [Pokemon!]
    pokemonByType(type1: String!): [Pokemon!]!
    searchPokemon(name: String!): [Pokemon!]!
    allUsers: [User!]!
    teamById(teamId: ID!): Team
    allTeams: [Team!]!
    myTeams: [Team!]!
  }


  type User {
    id: ID!
    email: String!
  }

  type TeamMember {
    id: ID!
    pokemon: Pokemon!
  }

  type Team {
    id: ID!
    name: String!
    user: User!
    members: [TeamMember!]!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    addPokemonToTeam(teamId: ID!, pokemonId: ID!) :Team!
    
    removePokemonFromTeam(teamId: ID!, pokemonId: ID!) :Team!

    createTeam(name: String!): Team!

    deleteTeam(teamId: ID!): Team!

    updateTeam(teamId: ID!, name: String!): Team!
  }
`