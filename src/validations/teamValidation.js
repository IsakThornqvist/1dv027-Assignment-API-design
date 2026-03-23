import prisma from "../prisma.js"
import { GraphQLError } from 'graphql'



export function checkAuth(context) {
    if (!context.userId) {
       throw new GraphQLError("No authenticaition!", {
        extensions: { code: "UNAUTHENTICATED", http: { status: 401 }}
       }) 
    }
}

export async function getTeamAndVerifyOwnership(teamId, userId) {
    const team = await prisma.team.findUnique({
        where: { id: parseInt(teamId) },
        include: {
          members: true,
        },
    })

    if (!team) {
        throw new GraphQLError('Team does not exist!', {
            extensions: { code: "NOT_FOUND", http: { status: 404 }}
        })
    }
    if (team.userId !== userId) {
        throw new GraphQLError('Not authorized!', {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 }}
        })
    }
    return team
}