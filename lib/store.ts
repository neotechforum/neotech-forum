export type Submission = {
  id: string
  type: 'contact' | 'precommande'
  date: string
  data: Record<string, string>
}

declare global {
  // eslint-disable-next-line no-var
  var __submissions: Submission[]
}

if (!global.__submissions) global.__submissions = []

export const store = {
  add(s: Omit<Submission, 'id' | 'date'>) {
    global.__submissions.unshift({
      ...s,
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
    })
    if (global.__submissions.length > 100) global.__submissions.pop()
  },
  getAll(): Submission[] {
    return global.__submissions
  },
}
