import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { TOGGLE_FAVORITE, SOFT_DELETE } from '../graphql/queries'

const statusColors = {
  Alive: 'bg-green-400',
  Dead: 'bg-red-400',
  unknown: 'bg-gray-400'
}

export default function CharacterCard({ character, refetch }) {
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE)
  const [softDelete] = useMutation(SOFT_DELETE)

  const handleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleFavorite({ variables: { character_id: character.id } })
    refetch()
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Delete ${character.name}?`)) {
      await softDelete({ variables: { id: character.id } })
      refetch()
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-200 hover:scale-105 group relative">
      <Link to={`/character/${character.id}`}>
        <div className="relative">
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 text-2xl z-10 hover:scale-110 transition-transform"
          >
            {character.isFavorite ? '⭐' : '☆'}
          </button>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold truncate text-sm">
            {character.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[character.status] || 'bg-gray-400'}`}></span>
            <span className="text-gray-400 text-xs truncate">
              {character.status} · {character.species}
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={handleDelete}
        className="absolute bottom-2 right-2 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 px-2 py-1 rounded"
      >
        🗑 Delete
      </button>
    </div>
  )
}