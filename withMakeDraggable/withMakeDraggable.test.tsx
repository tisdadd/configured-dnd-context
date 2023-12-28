import React from 'react'
import { render, screen } from '@testing-library/react'
import withMakeDraggable from './withMakeDraggable'

describe('withMakeDraggable(Component)', () => {
  it('Renders its children', () => {
    const testText = 'Testing'

    function Sample () {
      return <div>{testText}</div>
    }

    const Wrapped = withMakeDraggable(Sample)

    render(<Wrapped />)

    expect(screen.getByText(testText)).toBeInTheDocument()
  })
})
