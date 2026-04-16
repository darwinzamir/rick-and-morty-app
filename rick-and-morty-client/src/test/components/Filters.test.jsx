import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Filters from '../../components/Filters'

const defaultFilters = {
  name: '',
  status: '',
  species: '',
  gender: '',
  sortBy: 'A-Z'
}

describe('Filters component', () => {
  it('renders all filter controls', () => {
    render(<Filters filters={defaultFilters} onChange={() => {}} />)

    expect(screen.getByPlaceholderText('Search by name...')).toBeInTheDocument()
    expect(screen.getByDisplayValue('All Status')).toBeInTheDocument()
    expect(screen.getByDisplayValue('All Species')).toBeInTheDocument()
    expect(screen.getByDisplayValue('All Genders')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Sort A→Z')).toBeInTheDocument()
  })

  it('calls onChange when name input changes', () => {
    const handleChange = vi.fn()
    render(<Filters filters={defaultFilters} onChange={handleChange} />)

    const input = screen.getByPlaceholderText('Search by name...')
    fireEvent.change(input, { target: { value: 'Rick' } })

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      name: 'Rick'
    })
  })

  it('calls onChange when status filter changes', () => {
    const handleChange = vi.fn()
    render(<Filters filters={defaultFilters} onChange={handleChange} />)

    const select = screen.getByDisplayValue('All Status')
    fireEvent.change(select, { target: { value: 'Alive' } })

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      status: 'Alive'
    })
  })

  it('calls onChange when sort order changes', () => {
    const handleChange = vi.fn()
    render(<Filters filters={defaultFilters} onChange={handleChange} />)

    const select = screen.getByDisplayValue('Sort A→Z')
    fireEvent.change(select, { target: { value: 'Z-A' } })

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      sortBy: 'Z-A'
    })
  })
})