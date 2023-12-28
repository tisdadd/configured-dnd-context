import React from 'react'
import { render, screen } from '@testing-library/react'
import withMakeDroppable from './withMakeDroppable'

describe('withMakeDroppable(Component)', () => {
  it('Renders its children', () => {
    const testText = 'Testing'

    function Sample () {
      return <div>{testText}</div>
    }

    const Wrapped = withMakeDroppable(Sample)

    render(<Wrapped />)

    expect(screen.getByText(testText)).toBeInTheDocument()
  })
})
