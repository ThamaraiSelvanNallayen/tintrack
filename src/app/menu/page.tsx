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
  'h-10 w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'

export default async function MenuPage() {
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('menu_items').select('*').order('name'),
  ])

  const cats = categories ?? []
  const menu = items ?? []

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Menu Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize your product categories, manage pricing, and control item visibility.
          </p>
        </div>

        {/* Top Grid: Categories & Add Item */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Categories Section (1 Col on Desktop) */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5 lg:col-span-1">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Categories</h2>
              <p className="text-xs text-slate-500">Group your items logically.</p>
            </div>

            <form action={addCategory} className="space-y-3">
              <Input 
                name="name" 
                placeholder="New category (e.g. Beverages)" 
                required 
                className="h-10 rounded-lg border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-indigo-500"
              />
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all">
                Add Category
              </Button>
            </form>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {cats.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No categories created yet.</p>
                ) : (
                  cats.map((c) => (
                    <form key={c.id} action={deleteCategory} className="inline-block">
                      <input type="hidden" name="id" value={c.id} />
                      <Badge variant="secondary" className="gap-2 py-1.5 px-3 bg-indigo-50/80 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                        <span className="font-medium">{c.name}</span>
                        <button type="submit" title="Delete category" className="text-indigo-400 hover:text-red-600 font-bold transition-colors">
                          ×
                        </button>
                      </Badge>
                    </form>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Add Item Section (2 Cols on Desktop) */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5 lg:col-span-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Add New Menu Item</h2>
              <p className="text-xs text-slate-500">Add dishes or products available for point-of-sale orders.</p>
            </div>

            <form action={addItem} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1.5 sm:col-span-3 lg:col-span-1">
                <label className="text-xs font-medium text-slate-600">Item Name</label>
                <Input name="name" placeholder="e.g. Espresso" required className="h-10 rounded-lg border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-indigo-500" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Price (AED)</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  className="h-10 rounded-lg border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Category</label>
                <select name="category_id" className={selectClass} defaultValue="">
                  <option value="">No category</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3 pt-2">
                <Button type="submit" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all px-6">
                  Add Item to Menu
                </Button>
              </div>
            </form>
          </section>

        </div>

        {/* Items Listing Section */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold text-slate-800">Menu Inventory</h2>
            <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50">
              {menu.length} {menu.length === 1 ? 'item' : 'items'} total
            </Badge>
          </div>

          <div className="space-y-3">
            {menu.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No items added to your menu yet. Use the form above to add your first item.
              </div>
            ) : (
              menu.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/40 p-4 transition-all hover:bg-slate-50/80 hover:border-slate-200 ${
                    item.is_active ? '' : 'opacity-60 bg-slate-100/60'
                  }`}
                >
                  {/* Inline update form */}
                  <form action={updateItem} className="flex flex-wrap items-center gap-3 flex-1 w-full">
                    <input type="hidden" name="id" value={item.id} />
                    
                    <Input 
                      name="name" 
                      defaultValue={item.name} 
                      className="h-9 w-full sm:w-48 bg-white border-slate-200 text-sm shadow-sm" 
                    />
                    
                    <div className="relative w-28">
                      <span className="absolute left-3 top-2 text-xs text-slate-400">AED</span>
                      <Input
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={item.price}
                        className="h-9 pl-11 w-full bg-white border-slate-200 text-sm shadow-sm"
                      />
                    </div>

                    <select
                      name="category_id"
                      defaultValue={item.category_id ?? ''}
                      className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 shadow-sm"
                    >
                      <option value="">No category</option>
                      {cats.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <Button type="submit" size="sm" variant="secondary" className="h-9 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-sm">
                      Save
                    </Button>
                  </form>

                  {/* Actions (Toggle & Delete) */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <form action={toggleItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="is_active" value={String(item.is_active)} />
                      <Button 
                        type="submit" 
                        size="sm" 
                        variant="outline" 
                        className={`h-9 text-xs font-medium ${item.is_active ? 'text-amber-700 border-amber-200 hover:bg-amber-50' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                      >
                        {item.is_active ? 'Hide' : 'Show'}
                      </Button>
                    </form>

                    <form action={deleteItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button type="submit" size="sm" variant="destructive" className="h-9 text-xs bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-none">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </main>
  )
}