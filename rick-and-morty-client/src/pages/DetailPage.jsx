// DetailPage — displays full details of a single character.
// Allows the user to toggle favorites and add comments.

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CHARACTER, ADD_COMMENT, TOGGLE_FAVORITE } from '../graphql/queries'

// Maps status values to Tailwind text color classes
const statusColors = {
  Alive: 'text-green-400',
  Dead: 'text-red-400',
  unknown: 'text-gray-400'
}

export default function DetailPage() {

  // Extract character ID from the URL parameters
  const { id } = useParams()

  // Local state for the comment form fields
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  // Fetch full character details including comments and favorite status
  const { loading, error, data, refetch } = useQuery(GET_CHARACTER, {
    variables: { id: parseInt(id) }
  })

  const [addComment, { loading: adding }] = useMutation(ADD_COMMENT)
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE)

  // Show spinner while loading
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400"></div>
    </div>
  )

  if (error) return (
    <div className="text-red-400 text-center py-10">
      Error: {error.message}
    </div>
  )

  const c = data?.character
  if (!c) return (
    <div className="text-center py-10 text-gray-400">
      Character not found
    </div>
  )

  // Submit a new comment — prevents empty submissions
  const handleComment = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    await addComment({
      variables: {
        character_id: parseInt(id),
        author: author || 'Anonymous',
        content
      }
    })
    // Clear the form and refresh character data to show the new comment
    setAuthor('')
    setContent('')
    refetch()
  }

  // Toggle favorite and refresh to reflect the updated state
  const handleFavorite = async () => {
    await toggleFavorite({ variables: { character_id: parseInt(id) } })
    refetch()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      {/* Back navigation link */}
      <Link
        to="/"
        className="text-green-400 hover:text-green-300 mb-6 inline-flex items-center gap-2 transition-colors"
      >
        ← Back to Portal Directory
      </Link>

      <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 mt-4">

        {/* Character header — image on the left, details on the right (Flexbox) */}
        <div className="md:flex">
          <img
            src={c.image}
            alt={c.name}
            className="md:w-72 w-full object-cover"
          />
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-white">{c.name}</h1>

              {/* Favorite toggle button */}
              <button
                onClick={handleFavorite}
                className="text-3xl hover:scale-110 transition-transform flex-shrink-0"
              >
                {c.isFavorite ? '⭐' : '☆'}
              </button>
            </div>

            {/* Status indicator with color coding */}
            <p className={`text-lg mt-1 ${statusColors[c.status]}`}>
              ● {c.status}
            </p>

            {/* Character attributes displayed in a 2-column CSS Grid */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {[
                ['Species', c.species],
                ['Type', c.type || 'N/A'],
                ['Gender', c.gender],
                ['Origin', c.origin],
                ['Location', c.location]
              ].map(([label, val]) => (
                <div key={label}>
                  <span className="text-gray-400 text-xs uppercase tracking-wide">{label}</span>
                  <p className="text-white font-medium mt-1">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="p-6 border-t border-gray-700">
          <h2 className="text-xl font-semibold text-green-400 mb-4">
            💬 Comments ({c.comments?.length || 0})
          </h2>

          {/* Scrollable list of existing comments */}
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {c.comments?.length === 0 && (
              <p className="text-gray-500 text-sm">
                No comments yet. Be the first!
              </p>
            )}
            {c.comments?.map(comment => (
              <div key={comment.id} className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-green-400 text-sm font-medium">
                    {comment.author}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(comment.createdAt).toLocaleDateString('en-US')}
                  </span>
                </div>
                <p className="text-gray-200 text-sm">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Comment submission form */}
          <form onSubmit={handleComment} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-green-400 outline-none"
            />
            <textarea
              placeholder="Write a comment..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-green-400 outline-none resize-none"
            />

            {/* Submit button — disabled while posting or if content is empty */}
            <button
              type="submit"
              disabled={adding || !content.trim()}
              className="bg-green-500 hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors self-end"
            >
              {adding ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}