import type { SupabaseClient } from '@supabase/supabase-js'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // décompose les accents (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '') // retire les accents décomposés
    .replace(/[^a-z0-9\s-]/g, '') // retire tout sauf lettres/chiffres/espaces/tirets
    .replace(/\s+/g, '-') // espaces → tirets
    .replace(/-+/g, '-') // tirets multiples → un seul
    .replace(/^-|-$/g, '') // retire tiret en début/fin
}

export async function generateUniqueSlug(
  supabase: SupabaseClient,
  title: string,
): Promise<string> {
  const baseSlug = slugify(title)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const { data } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!data) break // slug disponible

    counter += 1
    slug = `${baseSlug}-${counter}`
  }

  return slug
}
