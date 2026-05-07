import { openDB, type DBSchema } from 'idb'
import { defaultProfile } from './defaultProfiles'
import { localProfileSchema, profileWithUpdatedAt, type LocalProfile } from './schema'

const DB_NAME = 'match-proof'
const DB_VERSION = 1
const ACTIVE_PROFILE_KEY = 'active-profile'

interface MatchProofDb extends DBSchema {
  profiles: {
    key: string
    value: LocalProfile
  }
  settings: {
    key: string
    value: string
  }
}

async function database() {
  return openDB<MatchProofDb>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('profiles')) {
        db.createObjectStore('profiles', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }
    },
  })
}

export async function loadActiveProfile(): Promise<LocalProfile> {
  const db = await database()
  const activeId = await db.get('settings', ACTIVE_PROFILE_KEY)
  const stored = activeId ? await db.get('profiles', activeId) : undefined

  if (stored) {
    return localProfileSchema.parse(stored)
  }

  await saveActiveProfile(defaultProfile)
  return defaultProfile
}

export async function saveActiveProfile(profile: LocalProfile): Promise<LocalProfile> {
  const parsed = localProfileSchema.parse(profileWithUpdatedAt(profile))
  const db = await database()
  await db.put('profiles', parsed)
  await db.put('settings', parsed.id, ACTIVE_PROFILE_KEY)
  return parsed
}

export async function clearProfiles(): Promise<void> {
  const db = await database()
  await db.clear('profiles')
  await db.clear('settings')
}
