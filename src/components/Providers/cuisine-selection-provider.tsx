// context/cuisine-selection.tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Cuisine } from '#/schema/cuisine'

type CuisineSelectionContextValue = {
  selectedCuisine: Cuisine | null
  selectCuisine: (cuisine: Cuisine | null) => void
}

const CuisineSelectionContext =
  createContext<CuisineSelectionContextValue | null>(null)

export function CuisineSelectionProvider({
  children,
}: {
  children: ReactNode
}) {
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null)

  const selectCuisine = (cuisine: Cuisine | null) => {
    setSelectedCuisine((prev) => (prev?.id === cuisine?.id ? null : cuisine))
  }

  return (
    <CuisineSelectionContext.Provider
      value={{ selectedCuisine, selectCuisine }}
    >
      {children}
    </CuisineSelectionContext.Provider>
  )
}

export function useCuisineSelection() {
  const ctx = useContext(CuisineSelectionContext)
  if (!ctx)
    throw new Error(
      'useCuisineSelection must be used within CuisineSelectionProvider',
    )
  return ctx
}
