import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { env } from './env'

type Todo = { id: number; title: string; is_done: boolean; created_at?: string }

const supabase = env.SUPABASE_URL && env.SUPABASE_ANON_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  : null

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')

  async function loadTodos() {
    const res = await fetch(`${env.API_BASE_URL}/api/todos`)
    const json = await res.json()
    setTodos(json.data || [])
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const res = await fetch(`${env.API_BASE_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    const json = await res.json()
    if (json.data) {
      setTodos(prev => [json.data, ...prev])
      setTitle('')
    }
  }

  useEffect(() => { loadTodos() }, [])

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Railway + React + FastAPI + Supabase</h1>
      <p style={{ color: '#666' }}>Simple Todos demo. Backend stores todos in Supabase.</p>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add a todo…"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '10px 16px', borderRadius: 8 }}>Add</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {todos.map(t => (
          <li key={t.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, marginBottom: 8 }}>
            <strong>{t.title}</strong>
            {t.is_done ? ' ✅' : ''}
            <div style={{ fontSize: 12, color: '#999' }}>{t.created_at ? new Date(t.created_at).toLocaleString() : ''}</div>
          </li>
        ))}
      </ul>

      <section style={{ marginTop: 32 }}>
        <h2>Direct Supabase (client) check</h2>
        {!supabase ? (
          <p>Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to use the client here.</p>
        ) : (
          <p>Supabase client configured. (This demo does not query directly via client; backend is the source of truth.)</p>
        )}
      </section>
    </main>
  )
}