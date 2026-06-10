import { Redis } from '@upstash/redis'

export type Submission = {
  id: string
  type: 'contact' | 'precommande'
  date: string
  data: Record<string, string>
}

const redis = Redis.fromEnv()

const KEY = 'neotech:submissions'

export const store = {
  async add(s: Omit<Submission, 'id' | 'date'>) {
    const submission: Submission = {
      ...s,
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
    }
    await redis.lpush(KEY, JSON.stringify(submission))
    await redis.ltrim(KEY, 0, 199) // garde les 200 derniers
  },

  async getAll(): Promise<Submission[]> {
    const items = await redis.lrange(KEY, 0, -1)
    return items.map(item =>
      typeof item === 'string' ? JSON.parse(item) : item
    ) as Submission[]
  },
}
