import { NextResponse, NextRequest } from 'next/server'
import { updateAdminPassword } from '@/lib/admin'
import { jwtVerify } from 'jose'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify JWT to get Admin ID
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-jwt-secret-key')
    let payload
    try {
      const verified = await jwtVerify(token, secret)
      payload = verified.payload
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { newPassword } = await request.json()
    
    // Update password using the ID from the token (secure)
    const success = await updateAdminPassword(payload.id as string, newPassword)

    if (!success) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}