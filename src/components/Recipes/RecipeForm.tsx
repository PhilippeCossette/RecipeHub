import { recipeFormSchema, type Recipe } from '#/schema/recipes'
import { useForm } from '@tanstack/react-form'
import TextInput from '../ui/TextInput'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { CircleAlert, Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { CoverImageUpload } from '../ui/CoverImageUpload'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useCreateRecipeMutation } from '#/hooks/recipes/useCreateRecipeMutation'
import { useUpdateRecipeMutation } from '#/hooks/recipes/useUpdateRecipeMutation'
import { useGoBack } from '#/hooks/useGoBack'
import DrawerController from '../Button/DrawerController'
import CategoryForm from '../Category/CategoryForm'
import { getCuisinesQuery } from '#/queries/cuisine'
import { getCategoriesQuery } from '#/queries/category'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import CuisineForm from '../Cuisine/CuisineForm'

interface RecipeFormProps {
  recipe?: Recipe
}

export function RecipeForm({ recipe }: RecipeFormProps) {
  const [openCategoryForm, setOpenCategoryForm] = useState(false)
  const [openCuisineForm, setOpenCuisineForm] = useState(false)
  const isEditMode = !!recipe
  const { data: categories } = useSuspenseQuery(getCategoriesQuery())
  const { data: cuisines } = useSuspenseQuery(getCuisinesQuery())

  const goBack = useGoBack()

  const createRecipe = useCreateRecipeMutation(recipe?.slug)
  const updateRecipe = useUpdateRecipeMutation(recipe?.id)

  const form = useForm({
    validators: {
      onSubmit: recipeFormSchema,
    },

    defaultValues: {
      title: recipe?.title ?? '',
      description: recipe?.description ?? '',
      ingredients: recipe?.ingredients ?? [''],
      steps: recipe?.steps ?? [''],
      category_id: recipe?.category_id ?? '',
      cuisine_id: recipe?.cuisine_id ?? '',
      prep_time_minutes: recipe?.prep_time_minutes ?? null,
      cook_time_minutes: recipe?.cook_time_minutes ?? null,
      servings: recipe?.servings ?? null,
      coverImageFile: null as File | null,
      cover_image_url: recipe?.cover_image_url ?? null,
    },

    onSubmit: async ({ value }) => {
      if (isEditMode) {
        updateRecipe.mutate(value)
        return
      }
      createRecipe.mutate(value)
    },
  })

  const isPending = createRecipe.isPending || updateRecipe.isPending

  return (
    <section className="flex gap-5 flex-col md:flex-row">
      {recipe?.cover_image_url ? (
        <img
          className="object-cover rounded-2xl w-full max-w-lg md:max-w-sm h-fit aspect-square bg-muted"
          src={recipe.cover_image_url}
          alt="Cover"
        />
      ) : (
        <div className="flex justify-center items-center rounded-2xl w-full max-w-lg md:max-w-sm h-fit aspect-square bg-muted">
          No image yet
        </div>
      )}

      <form
        className="flex-1 flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-col gap-5">
          <TextInput
            form={form}
            name="title"
            label="Title"
            type="text"
            validator={recipeFormSchema.shape.title}
            placeholder="Title of the recipe"
          />
          <TextInput
            form={form}
            name="description"
            label="Description"
            type="textarea"
            validator={recipeFormSchema.shape.description}
            placeholder="Description of the recipe"
          />
          <form.Field name="coverImageFile">
            {(fileField) => (
              <form.Field name="cover_image_url">
                {(urlField) => (
                  <CoverImageUpload
                    file={fileField.state.value}
                    currentUrl={urlField.state.value}
                    onFileChange={(file) => fileField.handleChange(file)}
                    onRemove={() => {
                      fileField.handleChange(null)
                      urlField.handleChange(null)
                    }}
                  />
                )}
              </form.Field>
            )}
          </form.Field>

          <Card>
            <CardHeader>Ingredients</CardHeader>
            <CardContent>
              <form.Field name="ingredients" mode="array">
                {(ingredientsField) => (
                  <div className="flex flex-col gap-3">
                    {ingredientsField.state.value.map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex gap-2 flex-1">
                          <TextInput
                            form={form}
                            name={`ingredients[${index}]`}
                            type="text"
                            validator={
                              recipeFormSchema.shape.ingredients.element
                            }
                            placeholder={`Ingredient ${index + 1}`}
                          />
                          {ingredientsField.state.value.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                ingredientsField.removeValue(index)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() => ingredientsField.pushValue('')}
                    >
                      <Plus className="h-4 w-4" />
                      Add ingredient
                    </Button>
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Steps</CardHeader>
            <CardContent>
              <form.Field name="steps" mode="array">
                {(stepsField) => (
                  <div className="flex flex-col gap-3">
                    {stepsField.state.value.map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex gap-2 flex-1">
                          <TextInput
                            form={form}
                            name={`steps[${index}]`}
                            type="text"
                            validator={recipeFormSchema.shape.steps.element}
                            placeholder={`Describe step ${index + 1}`}
                          />
                          {stepsField.state.value.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => stepsField.removeValue(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() => stepsField.pushValue('')}
                    >
                      <Plus className="h-4 w-4" />
                      Add step
                    </Button>
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-3">
            <form.Field
              name="category_id"
              validators={{
                onChange: recipeFormSchema.shape.category_id,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={field.name}>Category</label>
                  <div className="flex gap-1">
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={!!field.state.meta.errors.length}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {field.state.meta.errors.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 p-0 hover:bg-transparent hover:scale-110 transition-all duration-200 animate-pulse text-red-400 hover:text-red-700"
                          >
                            <CircleAlert className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {field.state.meta.errors[0]?.message ??
                              'No error message available'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field
              name="cuisine_id"
              validators={{
                onChange: recipeFormSchema.shape.cuisine_id,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={field.name}>Cuisine</label>
                  <div className="flex gap-1">
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={!!field.state.meta.errors.length}
                      >
                        <SelectValue placeholder="Select a Cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisines.map((cuisine) => (
                          <SelectItem key={cuisine.id} value={cuisine.id}>
                            {cuisine.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {field.state.meta.errors.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 p-0 hover:bg-transparent hover:scale-110 transition-all duration-200 animate-pulse text-red-400 hover:text-red-700"
                          >
                            <CircleAlert className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {field.state.meta.errors[0]?.message ??
                              'No error message available'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )}
            </form.Field>

            <TextInput
              form={form}
              name="prep_time_minutes"
              label="Prep Time (minutes)"
              type="number"
              validator={recipeFormSchema.shape.prep_time_minutes}
              placeholder="Prep time in minutes"
            />
            <TextInput
              form={form}
              name="cook_time_minutes"
              label="Cook Time (minutes)"
              type="number"
              validator={recipeFormSchema.shape.cook_time_minutes}
              placeholder="Cook time in minutes"
            />
            <TextInput
              form={form}
              name="servings"
              label="Servings"
              type="number"
              validator={recipeFormSchema.shape.servings}
              placeholder="Enter Servings"
            />
          </div>
          <Button type="button" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
        <div className="mt-8 flex gap-2">
          <Button
            variant="destructive"
            type="button"
            disabled={isPending}
            onClick={goBack}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending
              ? 'Saving...'
              : isEditMode
                ? 'Update Recipe'
                : 'Create Recipe'}
          </Button>
          <DrawerController
            customBoolean={openCategoryForm}
            customOnChange={setOpenCategoryForm}
            tooltipContent="Testing"
            label="Add Category"
          >
            <CategoryForm onSuccess={() => setOpenCategoryForm(false)} />
          </DrawerController>
          <DrawerController
            customBoolean={openCuisineForm}
            customOnChange={setOpenCuisineForm}
            tooltipContent="Testing"
            label="Add Cuisine"
          >
            <CuisineForm onSuccess={() => setOpenCuisineForm(false)} />
          </DrawerController>
        </div>
      </form>
    </section>
  )
}
