import React from 'react'
import { render, screen } from '@testing-library/react'
import SortableCollection from './SortableCollection'

describe('SortableCollection', () =>
  it('renders learn react link', () => {
    render(<SortableCollection />)
    const linkElement = screen.getByText(/no items/i)
    expect(linkElement).to
  }))
