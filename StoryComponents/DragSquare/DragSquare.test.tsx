import React from 'react'
import { render, screen } from '@testing-library/react'
import DragSquare from './DragSquare'

describe('DragSquare', () =>
  it('renders learn react link', () => {
    render(<DragSquare />)
    const linkElement = screen.getByText(/Drag Me/i)
    expect(linkElement).toBeInTheDocument()
  }))
