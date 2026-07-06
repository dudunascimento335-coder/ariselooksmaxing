import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, name: string, verifyLink: string) {
  await resend.emails.send({
    from: 'SystemLooks <noreply@systemlooks.com>',
    to: email,
    subject: 'Confirme seu email - SystemLooks',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0ea5e9;">Bem-vindo ao Sistema, ${name}!</h1>
        <p>Clique no botão abaixo para confirmar seu email e ativar sua conta.</p>
        <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #0ea5e9, #a855f7); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Confirmar Email
        </a>
        <p style="color: #666; font-size: 14px;">Este link expira em 24 horas.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, name: string, resetLink: string) {
  await resend.emails.send({
    from: 'SystemLooks <noreply@systemlooks.com>',
    to: email,
    subject: 'Redefinir Senha - SystemLooks',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0ea5e9;">Redefinir Senha</h1>
        <p>Olá ${name},</p>
        <p>Clique no botão abaixo para redefinir sua senha.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #0ea5e9, #a855f7); color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Redefinir Senha
        </a>
        <p style="color: #666; font-size: 14px;">Este link expira em 1 hora.</p>
      </div>
    `,
  })
}
