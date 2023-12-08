import React from 'react'
import { render, screen } from '@testing-library/react'
import Square from './Square'

describe('ConfiguredDndContext/StoryComponents/Square', () =>
  it('renders with text drag me', () => {
    render(<Square />)
    const linkElement = screen.getByText(/drag me/i)
    expect(linkElement).toBeInTheDocument()
  }))
