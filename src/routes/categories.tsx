import { createFileRoute, Link } from '@tanstack/react-router'
import {
  IconMug,
  IconBurger,
  IconToolsKitchen3,
  IconCookie,
  IconIceCream,
  IconGlassGin,
  IconArrowUpRight,
} from '@tabler/icons-react'

export const Route = createFileRoute('/categories')({
  component: RouteComponent,
})

type Category = {
  title: string
  description: string
  icon: React.ReactNode
  url: string
  colorLight: string
  colorDark: string
}

const categories: Category[] = [
  {
    title: 'Breakfast',
    description: 'Start your day with delicious breakfast ideas.',
    icon: <IconMug stroke={1.75} className="size-5" />,
    url: '/recipes?category=breakfast',
    colorLight: '#FFD3D3',
    colorDark: '#3D1C1A',
  },
  {
    title: 'Lunch',
    description: 'Fresh and satisfying meals for the middle of your day.',
    icon: <IconBurger stroke={1.75} className="size-5" />,
    url: '/recipes?category=lunch',
    colorLight: '#FFE3B3',
    colorDark: '#3A2C10',
  },
  {
    title: 'Dinner',
    description: 'Hearty recipes perfect for family dinners.',
    icon: <IconToolsKitchen3 stroke={1.75} className="size-5" />,
    url: '/recipes?category=dinner',
    colorLight: '#D4F0C2',
    colorDark: '#243318',
  },
  {
    title: 'Snacks',
    description: 'Quick bites and tasty treats between meals.',
    icon: <IconCookie stroke={1.75} className="size-5" />,
    url: '/recipes?category=snacks',
    colorLight: '#C2E8F0',
    colorDark: '#132C31',
  },
  {
    title: 'Desserts',
    description: 'Sweet recipes to finish every meal.',
    icon: <IconIceCream stroke={1.75} className="size-5" />,
    url: '/recipes?category=desserts',
    colorLight: '#D9C9F5',
    colorDark: '#28203D',
  },
  {
    title: 'Beverages',
    description: 'Refreshing drinks to complement your meals.',
    icon: <IconGlassGin stroke={1.75} className="size-5" />,
    url: '/recipes?category=beverages',
    colorLight: '#FFCCE5',
    colorDark: '#3A1B2C',
  },
]

function RouteComponent() {
  return (
    <main className="pageLayout">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Categories
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse recipes by category
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}
      </div>
    </main>
  )
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={category.url}
      className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={
        {
          '--chip-light': category.colorLight,
          '--chip-dark': category.colorDark,
        } as React.CSSProperties
      }
    >
      <div className="flex size-11 items-center justify-center rounded-lg text-foreground bg-[var(--chip-light)] dark:bg-[var(--chip-dark)]">
        {category.icon}
      </div>

      <div>
        <h2 className="font-medium text-foreground">{category.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      </div>

      <IconArrowUpRight
        stroke={1.75}
        className="absolute right-4 top-4 size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
    </Link>
  )
}
