import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Birthday } from '@/types'

type BirthdayInsert = Omit<Database['public']['Tables']['birthdays']['Insert'], 'user_id'>
type BirthdayUpdate = Database['public']['Tables']['birthdays']['Update']

export async function getBirthdays(userId: string): Promise<Birthday[]> {
  const { data, error } = await supabase
    .from('birthdays')
    .select('*')
    .eq('user_id', userId)
    .order('birth_date', { ascending: true })

  if (error) throw error
  return data
}

export async function createBirthday(
  userId: string,
  birthdayData: BirthdayInsert,
): Promise<Birthday> {
  const { data, error } = await supabase
    .from('birthdays')
    .insert({ ...birthdayData, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBirthday(
  id: string,
  updates: BirthdayUpdate,
): Promise<Birthday> {
  const { data, error } = await supabase
    .from('birthdays')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBirthday(id: string): Promise<void> {
  const { error } = await supabase
    .from('birthdays')
    .delete()
    .eq('id', id)

  if (error) throw error
}
