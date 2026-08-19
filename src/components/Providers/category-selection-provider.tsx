// context/category-selection.tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Category } from '#/schema/category'

type CategorySelectionContextValue = {
  selectedCategory: Category | null
  selectCategory: (category: Category | null) => void
}

const CategorySelectionContext =
  createContext<CategorySelectionContextValue | null>(null)

export function CategorySelectionProvider({
  children,
}: {
  children: ReactNode
}) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )

  const selectCategory = (category: Category | null) => {
    setSelectedCategory((prev) =>
      prev?.id === category?.id ? null : category,
    )
  }

  return (
    <CategorySelectionContext.Provider
      value={{ selectedCategory, selectCategory }}
    >
      {children}
    </CategorySelectionContext.Provider>
  )
}

export function useCategorySelection() {
  const ctx = useContext(CategorySelectionContext)
  if (!ctx)
    throw new Error(
      'useCategorySelection must be used within CategorySelectionProvider',
    )
  return ctx
}
