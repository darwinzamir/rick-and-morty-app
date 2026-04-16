// CharacterCard component — displays a character's image, name, status and species.
// Supports toggling favorites and soft-deleting the character directly from the card.

import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { TOGGLE_FAVORITE, SOFT_DELETE } from '../graphql/queries'

// Maps status values to Tailwind color classes for the status indicator dot
const statusColors = {
  Alive: 'bg-green-400',
  Dead: 'bg-red-400',
  unknown: 'bg-gray-400'
}

export default function CharacterCard({ character, refetch }) {
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE)
  const [softDelete] = useMutation(SOFT_DELETE)

  // Toggle favorite status and refresh the character list
  const handleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation() // Prevent navigating to detail page
    await toggleFavorite({ variables: { character_id: character.id } })
    refetch()
  }

  // Soft-delete the character after user confirmation
  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation() // Prevent navigating to detail page
    if (window.confirm(`Delete ${character.name}?`)) {
      await softDelete({ variables: { id: character.id } })
      refetch()
    }
  }

  return (
    // Card container — scales up on hover and highlights border on hover
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-200 hover:scale-105 group relative">

      {/* Clicking the card navigates to the character detail page */}
      <Link to={`/character/${character.id}`}>
        <div className="relative">
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-48 object-cover"
          />

          {/* Favorite toggle button — shown over the character image */}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 text-2xl z-10 hover:scale-110 transition-transform"
          >
            {character.isFavorite ? '⭐' : '☆'}
          </button>
        </div>

        {/* Character name and status/species info */}
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

      {/* Delete button — only visible when hovering over the card */}
      <button
        onClick={handleDelete}
        className="absolute bottom-2 right-2 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 px-2 py-1 rounded"
      >
        🗑 Delete
      </button>
    </div>
  )
}