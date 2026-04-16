import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_CHARACTERS } from '../graphql/queries'
import CharacterCard from '../components/CharacterCard'
import Filters from '../components/Filters'

export default function HomePage() {
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    species: '',
    gender: '',
    sortBy: 'A-Z'
  })

  const { loading, error, data, refetch } = useQuery(GET_CHARACTERS, {
    variables: {
      name: filters.name || undefined,
      status: filters.status || undefined,
      species: filters.species || undefined,
      gender: filters.gender || undefined,
      sortBy: filters.sortBy
    }
  })

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400"></div>
    </div>
  )

  if (error) return (
    <div className="text-red-400 text-center py-10">
      <p className="text-xl">Error loading characters</p>
      <p className="text-sm mt-2">{error.message}</p>
    </div>
  )

  const characters = data?.characters?.filter(c => !c.is_deleted) || []

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Filters filters={filters} onChange={setFilters} />
      <p className="text-gray-400 text-sm mb-6">
        {characters.length} character{characters.length !== 1 ? 's' : ''} found
      </p>
      {characters.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">🛸</p>
          <p>No characters found with those filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map(char => (
            <CharacterCard key={char.id} character={char} refetch={refetch} />
          ))}
        </div>
      )}
    </main>
  )
}