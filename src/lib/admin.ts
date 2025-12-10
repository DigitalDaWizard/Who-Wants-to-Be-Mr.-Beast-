import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export interface AdminSession {
  id: string
  username: string
  loginTime: number
}

export async function verifyAdminCredentials(username: string, password: string) {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .single()
  
  if (error || !data) return null
  
  const isValid = await bcrypt.compare(password, data.password_hash)
  return isValid ? data : null
}

export async function updateAdminPassword(adminId: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  const { error } = await supabase
    .from('admin_users')
    .update({ 
      password_hash: hashedPassword,
      last_password_change: new Date().toISOString()
    })
    .eq('id', adminId)
  
  return !error
}

export async function logAdminAction(adminId: string, action: string, details: any) {
  await supabase
    .from('admin_logs')
    .insert({
      admin_id: adminId,
      action,
      details
    })
}