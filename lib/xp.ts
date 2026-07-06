import { prisma } from './prisma'

export async function grantXp(userId: string, amount: number, reason: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  const newXp = user.xp + amount
  const xpNeeded = 100 + user.level * 50
  const newLevel = newXp >= xpNeeded ? user.level + 1 : user.level

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel,
    },
  })
}
