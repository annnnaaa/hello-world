import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { CalendarEvent, Birthday } from '@/types'
import { useAuth } from './useAuth'
import { generateId } from '@/lib/utils'

export function useCalendar() {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [birthdays, setBirthdays] = useState<Birthday[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    const [eventsRes, birthdaysRes] = await Promise.all([
      supabase.from('calendar_events').select('*').eq('user_id', user.id).order('start_date'),
      supabase.from('birthdays').select('*').eq('user_id', user.id).order('date'),
    ])
    setEvents(eventsRes.data ?? [])
    setBirthdays(birthdaysRes.data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return
    const newEvent: CalendarEvent = {
      ...event,
      id: generateId(),
      user_id: user.id,
      created_at: new Date().toISOString(),
    }
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.start_date.localeCompare(b.start_date)))
    await supabase.from('calendar_events').insert(newEvent)
  }, [user])

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
    await supabase.from('calendar_events').update(updates).eq('id', id)
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    await supabase.from('calendar_events').delete().eq('id', id)
  }, [])

  const addBirthday = useCallback(async (birthday: Omit<Birthday, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return
    const newBirthday: Birthday = {
      ...birthday,
      id: generateId(),
      user_id: user.id,
      created_at: new Date().toISOString(),
    }
    setBirthdays(prev => [...prev, newBirthday])
    await supabase.from('birthdays').insert(newBirthday)
  }, [user])

  const deleteBirthday = useCallback(async (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id))
    await supabase.from('birthdays').delete().eq('id', id)
  }, [])

  return { events, birthdays, loading, addEvent, updateEvent, deleteEvent, addBirthday, deleteBirthday, refresh: fetch }
}
