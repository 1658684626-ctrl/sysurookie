import { readFileSync } from 'node:fs'

const checks = [
  ['db/schema.sql', 'create table if not exists public.event_checkpoints'],
  ['db/schema.sql', 'create table if not exists public.checkpoint_progress'],
  ['db/schema.sql', 'create table if not exists public.announcements'],
  ['db/schema.sql', 'create table if not exists public.announcement_confirmations'],
  ['db/rls-policies.sql', 'field staff manage checkpoint progress'],
  ['db/rls-policies.sql', 'participants read published relevant announcements'],
  ['src/services/adapters/supabaseAdapter.ts', 'checkInRegistration: async'],
  ['src/services/adapters/supabaseAdapter.ts', 'markRegistrationDeparted: async'],
  ['src/services/adapters/supabaseAdapter.ts', 'markCheckpointArrived: async'],
  ['src/services/adapters/supabaseAdapter.ts', 'submitCheckpointTask: async'],
  ['src/services/adapters/supabaseAdapter.ts', 'confirmAnnouncementRead: async'],
]

const missing = checks.filter(([file, pattern]) => {
  const content = readFileSync(file, 'utf8')

  return !content.includes(pattern)
})

if (missing.length > 0) {
  console.error('Cloud alpha verification failed:')
  for (const [file, pattern] of missing) {
    console.error(`- ${file} missing "${pattern}"`)
  }
  process.exit(1)
}

console.log('Cloud alpha verification passed.')
