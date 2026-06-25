import { addDays } from 'date-fns'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { CalendarEvent } from '@/types'

type EventInsert = Omit<Database['public']['Tables']['events']['Insert'], 'user_id'>
type EventUpdate = Database['public']['Tables']['events']['Update']

export async function getEventsInRange(
  userId: string,
  start: string,
  end: string,
): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .gte('start_at', start)
    .lte('start_at', end)
    .order('start_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getUpcomingEvents(
  userId: string,
  days: number = 7,
): Promise<CalendarEvent[]> {
  const now = new Date().toISOString()
  const futureDate = addDays(new Date(), days).toISOString()

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .gte('start_at', now)
    .lte('start_at', futureDate)
    .order('start_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createEvent(
  userId: string,
  eventData: EventInsert,
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('events')
    .insert({ ...eventData, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEvent(
  id: string,
  updates: EventUpdate,
): Promise<CalendarEvent> {
  const { data, error } = await supabase
    .from('events')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw error
}
