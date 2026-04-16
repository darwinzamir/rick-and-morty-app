import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: () => [vi.fn(), { loading: false }]
  }
})

import { useQuery } from '@apollo/client'
import DetailPage from '../../pages/DetailPage'

const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: 'Scientist',
  gender: 'Male',
  origin: 'Earth (C-137)',
  location: 'Citadel of Ricks',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  isFavorite: false,
  comments: []
}

const renderDetailPage = () => {
  return render(
    <MemoryRouter initialEntries={['/character/1']}>
      <Routes>
        <Route path="/character/:id" element={<DetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('DetailPage component', () => {
  it('shows loading spinner while fetching', () => {
    useQuery.mockReturnValue({
      loading: true,
      error: null,
      data: null,
      refetch: vi.fn()
    })
    renderDetailPage()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows error message when query fails', () => {
    useQuery.mockReturnValue({
      loading: false,
      error: { message: 'Network error' },
      data: null,
      refetch: vi.fn()
    })
    renderDetailPage()
    expect(screen.getByText(/Network error/i)).toBeInTheDocument()
  })

  it('renders character details correctly', () => {
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: { character: mockCharacter },
      refetch: vi.fn()
    })
    renderDetailPage()
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('● Alive')).toBeInTheDocument()
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument()
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument()
  })

  it('renders comments section', () => {
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: { character: mockCharacter },
      refetch: vi.fn()
    })
    renderDetailPage()
    expect(screen.getByText('💬 Comments (0)')).toBeInTheDocument()
    expect(screen.getByText('No comments yet. Be the first!')).toBeInTheDocument()
  })

  it('renders back button link', () => {
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: { character: mockCharacter },
      refetch: vi.fn()
    })
    renderDetailPage()
    expect(screen.getByText('← Back to Portal Directory')).toBeInTheDocument()
  })

  it('renders post comment button', () => {
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: { character: mockCharacter },
      refetch: vi.fn()
    })
    renderDetailPage()
    expect(screen.getByText('Post Comment')).toBeInTheDocument()
  })
})