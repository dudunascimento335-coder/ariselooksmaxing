export interface AttributeResult {
  name: string
  score: number
  tips: string[]
}

export interface AnalysisResult {
  overallScore: number
  attributes: AttributeResult[]
  haircutSuggestions: { name: string; explanation: string }[]
  beardSuggestions: { fits: boolean; style: string; howToGrow: string[] }
  styleSuggestions: { palette: string[]; pieces: string[]; accessories: string[] }
}

const ATTRIBUTES = [
  'Simetria Facial',
  'Pele',
  'Postura',
  'Proporção Corporal',
  'Expressividade',
]

export async function analyzePhotoWithAI(imageUrl: string): Promise<AnalysisResult> {
  // Placeholder - Integração real com OpenAI Vision API
  // const response = await openai.chat.completions.create({...})
  return analyzePhotoMock()
}

export function analyzePhotoMock(): AnalysisResult {
  const attributes = ATTRIBUTES.map((name, i) => ({
    name,
    score: 60 + Math.floor(Math.random() * 30),
    tips: [`Dica 1 para ${name}`, `Dica 2 para ${name}`],
  }))

  const overallScore = Math.round(
    attributes.reduce((sum, a) => sum + a.score, 0) / attributes.length
  )

  return {
    overallScore,
    attributes,
    haircutSuggestions: [
      { name: 'Fade Clássico', explanation: 'Combina com seu formato de rosto' },
      { name: 'Texturizado', explanation: 'Adiciona volume e movimento' },
    ],
    beardSuggestions: {
      fits: true,
      style: 'Barba curta aparada',
      howToGrow: ['Mantenha hidratado', 'Use óleo de barba', 'Apare semanalmente'],
    },
    styleSuggestions: {
      palette: ['Azul marinho', 'Branco', 'Cinza', 'Preto'],
      pieces: ['Camisa Oxford', 'Blazer estruturado', ' Jeans slim fit'],
      accessories: ['Relógio minimalista', 'Cinto de couro'],
    },
  }
}
