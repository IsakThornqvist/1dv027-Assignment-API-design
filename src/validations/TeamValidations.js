import prisma from "../prisma.js"

export function checkAuth(context) {
    if (!context.userId) {
       throw new Error("No authenticaition!") 
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
        throw new Error('Team does not exist!')
    }
    if (team.userId !== userId) {
        throw new Error('Not authorized!')
    }
    return team
}