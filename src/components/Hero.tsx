import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Field } from './ui/field'
import { Input } from './ui/input'
import { Highlighter } from '@/components/ui/highlighter'
import { useEffect, useState } from 'react'

export default function Hero() {
  return (
    <section className="relative flex flex-col items-start md:items-center md:text-center mb-20 mt-10">
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

// <div className="bg-red-900/10 grid gap-6 grid-cols-2 w-full h-full">
//         <img
//           className="max-w-[50vw] object-cover col-end-0 row-start-1 row-end-3"
//           src="https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_center,w_730,h_913/k%2FPhoto%2FRecipes%2F2023-01-Caramelized-Tomato-Paste-Pasta%2F06-CARAMELIZED-TOMATO-PASTE-PASTA-039_3981ac_cropped"
//           alt=""
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTlapTpFtv3aCdZS2UPmd1JZXa7j2NAgDkGUkwBdZ99-ozOkCR1KmDOJU&s=10"
//           alt=""
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmIMEKUGeEF-cvVuHrEZe_j86oYTSy8FWrVhr7mMdQEQ&s=10"
//           alt=""
//         />
//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTBVIFs5hNMEx0rv30gRS5myDnRD5biqVmUQVozYLbDRHDApMDKq_XmsI&s=10"
//           alt=""
//         />
//       </div>

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
