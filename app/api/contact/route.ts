import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = 'contact@neotech-forum.ch'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nom, email, entreprise, objet, message } = body

    store.add({ type: 'contact', data: { nom, email, entreprise, objet, message } })

    await resend.emails.send({
      from: 'NeoTech Forum <noreply@neotech-forum.ch>',
      to: TO,
      replyTo: email,
      subject: `[Contact] ${objet} — ${nom} (${entreprise})`,
      html: `
        <h2>Nouveau message — NeoTech Forum</h2>
        <table cellpadding="6">
          <tr><td><b>Nom</b></td><td>${nom}</td></tr>
          <tr><td><b>Email</b></td><td>${email}</td></tr>
          <tr><td><b>Entreprise</b></td><td>${entreprise}</td></tr>
          <tr><td><b>Objet</b></td><td>${objet}</td></tr>
        </table>
        <hr/>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
  }
}
