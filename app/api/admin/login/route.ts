import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id, password } = await req.json()

  if (id !== process.env.ADMIN_ID || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8h
    path: '/',
  })
  return res
}
