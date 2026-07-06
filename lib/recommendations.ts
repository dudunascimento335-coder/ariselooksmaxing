type SkinType = 'oleosa' | 'seca' | 'mista' | 'normal' | null

export function generateSkincareRoutine(skinType: SkinType) {
  const baseMorning = ['Lavar com sabonete adequado', 'Tônico', 'Sérum Vitamina C', 'Hidratante', 'Protetor Solar FPS 50']

  const baseNight = ['Dupla limpeza', 'Tônico', 'Retinol (alternar dias)', 'Hidratante noturno']

  return {
    morning: baseMorning,
    night: baseNight,
    goodHabits: ['Dormir 7-8 horas', 'Beber 2L de água', 'Evitar tocar o rosto'],
    badHabits: ['Fumar', 'Dormir de maquiagem', 'Usar toalha de rosto suja'],
  }
}

export function generateHygieneChecklist() {
  return [
    { item: 'Banho diário', detail: 'Use sabonete adequado e água morna' },
    { item: 'Escovar dentes', detail: '2-3x ao dia, após refeições' },
    { item: 'Desodorante', detail: 'Aplique após banho em pele seca' },
    { item: 'Cuidados com cabelo', detail: 'Lave a cada 1-2 dias' },
    { item: 'Unhas limpas', detail: 'Mantenha aparadas e limpas' },
  ]
}

export function generateWorkoutPlan(_attributes: unknown, location: 'casa' | 'academia') {
  return {
    level: 'Intermediário',
    progression: 'Comece com 3x semanal, aumente gradualmente',
    days: [
      { name: 'Push', exercises: location === 'academia' ? ['Supino', 'Desenvolvimento', 'Tríceps'] : ['Flexão', 'Fundo', 'Tríceps banco'] },
      { name: 'Pull', exercises: location === 'academia' ? ['Puxada', 'Remada', 'Bíceps'] : ['Remada TRX', 'Bíceps garrafa'] },
      { name: 'Legs', exercises: location === 'academia' ? ['Agachamento', 'Leg Press', 'Panturrilha'] : ['Agachamento', 'Afundo', 'Panturrilha escada'] },
    ],
  }
}

export function generateDietPlan(_attributes: unknown) {
  return {
    goal: 'Manutenção e definição muscular',
    calories: '2400-2800 kcal',
    macros: { protein: '180g', carbs: '280g', fat: '80g' },
    water: '3-4L/dia',
    meals: [
      { time: '07:00', meal: 'Café da manhã', suggestion: 'Ovos + aveia + fruta' },
      { time: '10:00', meal: 'Lanche', suggestion: 'Iogurte + castanhas' },
      { time: '13:00', meal: 'Almoço', suggestion: 'Arroz + frango + vegetais' },
      { time: '16:00', meal: 'Pré-treino', suggestion: 'Banana + whey' },
      { time: '19:30', meal: 'Jantar', suggestion: 'Batata doce + peixe + salada' },
      { time: '22:00', meal: 'Ceia', suggestion: 'Caseína ou cottage' },
    ],
    supplementation: ['Whey Protein', 'Creatina 5g/dia', 'Multivitamínico', 'Ômega 3'],
  }
}
