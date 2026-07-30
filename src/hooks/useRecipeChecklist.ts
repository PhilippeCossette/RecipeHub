import { useEffect, useState } from 'react'

type ChecklistState = {
  ingredients: boolean[]
  steps: boolean[]
}

function resizeArray(arr: boolean[], length: number) {
  const result = Array(length).fill(false)
  for (let i = 0; i < Math.min(arr.length, length); i++) {
    result[i] = arr[i]
  }
  return result
}

export function useRecipeChecklist(
  recipeId: string,
  ingredientsCount: number,
  stepsCount: number,
) {
  const storageKey = `recipe-checklist-${recipeId}`

  const [state, setState] = useState<ChecklistState>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed: ChecklistState = JSON.parse(stored)
        return {
          ingredients: resizeArray(parsed.ingredients, ingredientsCount),
          steps: resizeArray(parsed.steps, stepsCount),
        }
      }
    } catch (error) {
      console.error(`Error parsing checklist for recipe ${recipeId}:`, error)
    }
    return {
      ingredients: Array(ingredientsCount).fill(false),
      steps: Array(stepsCount).fill(false),
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, storageKey])

  const toggleIngredient = (index: number) => {
    setState((prev) => {
      const newIngredients = [...prev.ingredients]
      newIngredients[index] = !newIngredients[index]
      return { ...prev, ingredients: newIngredients }
    })
  }

  const toggleStep = (index: number) => {
    setState((prev) => {
      const newSteps = [...prev.steps]
      newSteps[index] = !newSteps[index]
      return { ...prev, steps: newSteps }
    })
  }

  const reset = () => {
    setState({
      ingredients: Array(ingredientsCount).fill(false),
      steps: Array(stepsCount).fill(false),
    })
  }

  return { ...state, toggleIngredient, toggleStep, reset }
}
