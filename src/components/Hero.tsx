import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Field } from './ui/field'
import { Input } from './ui/input'
import { Highlighter } from '@/components/ui/highlighter'
import { useEffect, useState } from 'react'

export default function Hero() {
  return (
    <section className="section-paddingX relative flex flex-col items-start md:items-center md:text-center mb-20">
      <h1 className="text-6xl md:text-8xl mb-8 font-bold max-w-[15ch]">
        What are you{' '}
        <Highlighter
          action="highlight"
          color="#87CEFA"
          animationDuration={500}
          iterations={2}
          isView={true}
        >
          cooking
        </Highlighter>{' '}
        today?
      </h1>
      <p className="text-md text-muted-foreground mb-10">
        Search by recipe or ingredient and discover something delicious.
      </p>
      <HeroSearchBar />
    </section>
  )
}

function HeroSearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const handleSearch = (value: string) => {
    navigate({
      to: '/recipes',
      search: {
        q: value || undefined,
        page: 1,
        limit: 12,
      },
    })
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearch(searchQuery)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchQuery])

  return (
    <Field className="max-w-150" orientation="horizontal">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="py-8"
        type="search"
        placeholder="Search..."
      />
      <Button
        className="py-8 px-12"
        type="submit"
        onClick={() => {
          handleSearch(searchQuery)
        }}
      >
        Search
      </Button>
    </Field>
  )
}
