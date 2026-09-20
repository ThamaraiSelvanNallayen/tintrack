'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

function fail(message: string): never {
  throw new Error(message) 
}

export async function addCategory(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return
  const { error } = await supabase.from('categories').insert({ name })
  if (error) fail(error.message)
  revalidatePath('/menu')
}

export async function deleteCategory(formData: FormData) {
  const id = Number(formData.get('id'))
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) fail(error.message)
  revalidatePath('/menu')
}

export async function addItem(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const price = Number(formData.get('price'))
  const categoryId = formData.get('category_id')
  if (!name || Number.isNaN(price) || price < 0) return
  const { error } = await supabase.from('menu_items').insert({
    name,
    price,
    category_id: categoryId ? Number(categoryId) : null,
  })
  if (error) fail(error.message)
  revalidatePath('/menu')
}

export async function updateItem(formData: FormData) {
  const id = Number(formData.get('id'))
  const name = String(formData.get('name') ?? '').trim()
  const price = Number(formData.get('price'))
  const categoryId = formData.get('category_id')
  if (!name || Number.isNaN(price) || price < 0) return
  const { error } = await supabase
    .from('menu_items')
    .update({
      name,
      price,
      category_id: categoryId ? Number(categoryId) : null,
    })
    .eq('id', id)
  if (error) fail(error.message)
  revalidatePath('/menu')
}

export async function toggleItem(formData: FormData) {
  const id = Number(formData.get('id'))
  const isActive = formData.get('is_active') === 'true'
  const { error } = await supabase
    .from('menu_items')
    .update({ is_active: !isActive })
    .eq('id', id)
  if (error) fail(error.message)
  revalidatePath('/menu')
}

export async function deleteItem(formData: FormData) {
  const id = Number(formData.get('id'))
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) fail(error.message)
  revalidatePath('/menu')
}