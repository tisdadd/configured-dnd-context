import React from 'react'
import { render, screen } from '@testing-library/react'
import BasicDroppable from './BasicDroppable'

describe('BasicDroppable', () =>
  it('renders learn react link', () => {
    render(<BasicDroppable />)
    const linkElement = screen.getByText(/drop here/i)
    expect(linkElement).toBeInTheDocument()
  }))
