import { supabase } from './supabase'

// --- Profile ---

export async function saveProfile(userId, profile) {
  if (!supabase) return
  await supabase
    .from('profiles')
    .upsert({ id: userId, data: profile, updated_at: new Date().toISOString() })
}

export async function loadProfile(userId) {
  if (!supabase) return null
  const { data } = await supabase
    .from('profiles')
    .select('data')
    .eq('id', userId)
    .single()
  return data?.data ?? null
}

// --- Affirmation reflections ---

export async function saveJournalEntry(userId, entry) {
  if (!supabase) return
  await supabase
    .from('journal_entries')
    .upsert({ ...entry, user_id: userId })
}

export async function loadJournalEntries(userId) {
  if (!supabase) return null
  const { data } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  return data ?? []
}

// --- Free-form daily journal ---

export async function saveDailyEntry(userId, entry) {
  if (!supabase) return
  const { id, date, body } = entry
  await supabase
    .from('daily_journal')
    .upsert({ id, user_id: userId, date, body })
}

export async function loadDailyEntries(userId) {
  if (!supabase) return null
  const { data } = await supabase
    .from('daily_journal')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  return data ?? []
}

// --- Migration: push localStorage data to Supabase on first sign-in ---

export async function migrateLocalStorage(userId) {
  if (!supabase) return

  const profile = (() => {
    try { return JSON.parse(localStorage.getItem('affirmation_profile') || 'null') } catch { return null }
  })()
  if (profile) await saveProfile(userId, profile)

  const journalEntries = (() => {
    try { return JSON.parse(localStorage.getItem('journal_entries') || '[]') } catch { return [] }
  })()
  for (const entry of journalEntries) await saveJournalEntry(userId, entry)

  const dailyEntries = (() => {
    try { return JSON.parse(localStorage.getItem('daily_journal') || '[]') } catch { return [] }
  })()
  for (const entry of dailyEntries) await saveDailyEntry(userId, entry)

  localStorage.setItem('supabase_migrated', '1')
}
