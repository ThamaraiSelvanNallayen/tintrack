import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('menu_items').select('*')
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">TinTrack</h1>
      <pre>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}