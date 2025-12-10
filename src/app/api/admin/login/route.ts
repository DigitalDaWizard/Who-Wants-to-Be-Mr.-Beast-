import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { verifyAdminCredentials } from '@/lib/admin'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    const admin = await verifyAdminCredentials(username, password)

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-jwt-secret-key')
    const token = await new SignJWT({ id: admin.id, username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret)

    const response = NextResponse.json({ success: true })
    
    // Set HTTP-only cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}