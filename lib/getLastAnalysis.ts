import { prisma } from './prisma'

type FullAnalysis = {
  id: string
  overallScore: number
  attributes: unknown
  haircutSuggestions: unknown
  beardSuggestions: unknown
  styleSuggestions: unknown
}

export async function getLastAnalysisFull(userId: string): Promise<FullAnalysis | null> {
  const analysis = await prisma.analysis.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return analysis as FullAnalysis | null
}

export async function getLastAnalysisAttributes(userId: string): Promise<string | null> {
  const analysis = await prisma.analysis.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { attributes: true },
  })

  if (!analysis) return null

  const attrs = analysis.attributes as { name: string; score: number }[]
  if (!attrs || !Array.isArray(attrs) || attrs.length === 0) return null

  // Retorna tipo de pele inferido (simplificado)
  return 'normal'
}
