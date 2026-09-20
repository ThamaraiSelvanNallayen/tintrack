import { supabase } from '@/lib/supabase'
import {
  addCategory,
  deleteCategory,
  addItem,
  updateItem,
  toggleItem,
  deleteItem,
} from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

const selectClass =
  'h-9 rounded-md border border-input bg-background px-2 text-sm'

export default async function MenuPage() {
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('menu_items').select('*').order('name'),
  ])

  const cats = categories ?? []
  const menu = items ?? []

  return (
    <main className="mx-auto max-w-4xl space-y-10 p-6">
      <h1 className="text-2xl font-bold">Menu management</h1>

      {/* Categories */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Categories</h2>
        <form action={addCategory} className="flex gap-2">
          <Input name="name" placeholder="New category (e.g. Desserts)" required />
          <Button type="submit">Add</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <form key={c.id} action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <Badge variant="secondary" className="gap-2 py-1">
                {c.name}
                <button type="submit" title="Delete category" className="text-red-600">
                  ×
                </button>
              </Badge>
            </form>
          ))}
        </div>
      </section>

      {/* Add item */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add item</h2>
        <form action={addItem} className="flex flex-wrap gap-2">
          <Input name="name" placeholder="Item name" required className="w-56" />
          <Input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price (AED)"
            required
            className="w-32"
          />
          <select name="category_id" className={selectClass} defaultValue="">
            <option value="">No category</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Button type="submit">Add item</Button>
        </form>
      </section>

      {/* Items */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Items ({menu.length})</h2>
        <div className="space-y-2">
          {menu.map((item) => (
            <div
              key={item.id}
              className={`flex flex-wrap items-center gap-2 rounded-md border p-2 ${
                item.is_active ? '' : 'opacity-50'
              }`}
            >
              <form action={updateItem} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={item.id} />
                <Input name="name" defaultValue={item.name} className="w-48" />
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={item.price}
                  className="w-28"
                />
                <select
                  name="category_id"
                  defaultValue={item.category_id ?? ''}
                  className={selectClass}
                >
                  <option value="">No category</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Button type="submit" size="sm">
                  Save
                </Button>
              </form>

              <form action={toggleItem}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="is_active" value={String(item.is_active)} />
                <Button type="submit" size="sm" variant="outline">
                  {item.is_active ? 'Hide' : 'Show'}
                </Button>
              </form>

              <form action={deleteItem}>
                <input type="hidden" name="id" value={item.id} />
                <Button type="submit" size="sm" variant="destructive">
                  Delete
                </Button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}