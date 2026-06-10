import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = 'contact@neotech-forum.ch'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nom, prenom, email, entreprise, poste, telephone, pass, message } = body

    store.add({ type: 'precommande', data: { nom, prenom, email, entreprise, poste, telephone, pass, message: message || '' } })

    await resend.emails.send({
      from: 'NeoTech Forum <noreply@neotech-forum.ch>',
      to: TO,
      replyTo: email,
      subject: `[Précommande] ${prenom} ${nom} — ${pass}`,
      html: `
        <h2>Nouvelle précommande — NeoTech Forum</h2>
        <table cellpadding="6">
          <tr><td><b>Nom</b></td><td>${prenom} ${nom}</td></tr>
          <tr><td><b>Email</b></td><td>${email}</td></tr>
          <tr><td><b>Entreprise</b></td><td>${entreprise}</td></tr>
          <tr><td><b>Poste</b></td><td>${poste}</td></tr>
          <tr><td><b>Téléphone</b></td><td>${telephone}</td></tr>
          <tr><td><b>Pass souhaité</b></td><td><b>${pass}</b></td></tr>
        </table>
        ${message ? `<hr/><p><b>Message :</b><br/>${message.replace(/\n/g, '<br/>')}</p>` : ''}
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 })
  }
}
