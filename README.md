# SystemLooks AI

Analise sua aparência com IA e receba recomendações personalizadas de estilo, skincare, treino e mais.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Prisma ORM)
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Email:** Resend
- **File Upload:** Uploadthing

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

## Features

- AI-powered facial analysis
- Personalized recommendations for:
  - Haircut styles
  - Beard grooming
  - Skincare routines
  - Workout plans
  - Diet suggestions
  - Fashion style
- Daily missions with XP system
- Subscription plans
- Admin dashboard

## License

MIT
