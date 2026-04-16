import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CharacterCard from '../../components/CharacterCard'

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useMutation: () => [vi.fn(), { loading: false }]
  }
})

const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  isFavorite: false,
  is_deleted: false
}

const renderCard = (character = mockCharacter, refetch = vi.fn()) => {
  return render(
    <MemoryRouter>
      <CharacterCard character={character} refetch={refetch} />
    </MemoryRouter>
  )
}

describe('CharacterCard component', () => {
  it('renders character name', () => {
    renderCard()
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
  })

  it('renders character species and status', () => {
    renderCard()
    expect(screen.getByText('Alive · Human')).toBeInTheDocument()
  })

  it('renders character image with correct alt text', () => {
    renderCard()
    const img = screen.getByAltText('Rick Sanchez')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockCharacter.image)
  })

  it('renders empty star when not favorite', () => {
    renderCard()
    expect(screen.getByText('☆')).toBeInTheDocument()
  })

  it('renders filled star when favorite', () => {
    renderCard({ ...mockCharacter, isFavorite: true })
    expect(screen.getByText('⭐')).toBeInTheDocument()
  })

  it('renders delete button on hover area', () => {
    renderCard()
    expect(screen.getByText('🗑 Delete')).toBeInTheDocument()
  })

  it('navigates to character detail page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/character/1')
  })
})