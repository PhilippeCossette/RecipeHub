import { getSupabaseServerClient } from '#/lib/supabase'
import type { Recipe } from '#/schema/recipes'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

const UserLikesSchema = z.object({
  userId: z.string(),
})

export const getUserLikesFn = createServerFn({ method: 'GET' })
  .validator(UserLikesSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: likedRecipes, error } = await supabase
      .from('likes')
      .select('recipe_id')
      .eq('user_id', data.userId)

    if (error) throw new Error(error.message)
    return likedRecipes.map((row) => row.recipe_id)
  })

type LikedRecipe = {
  recipes: Recipe
}

export const getLikedRecipesFn = createServerFn()
  .validator(UserLikesSchema)
  .handler(async ({ data }): Promise<Recipe[]> => {
    const supabase = getSupabaseServerClient()
    const { data: likedRecipes, error } = await supabase
      .from('likes')
      .select('recipes(*)')
      .eq('user_id', data.userId)
      .overrideTypes<LikedRecipe[]>()

    if (error) throw new Error(error.message)

    console.log(likedRecipes)

    return likedRecipes
      .map((row) => row.recipes)
      .filter((recipe): recipe is Recipe => recipe !== null)
  })
