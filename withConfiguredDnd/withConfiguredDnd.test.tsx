import React from 'react'
import { render, screen } from '@testing-library/react'
import withConfiguredDnd from './withConfiguredDnd'
import defaultValue from '../ConfiguredDndContext.defaultValue'
import withConfiguredDndAttachesPropTypes from './withConfiguredDnd.attachesPropTypes'

describe('withConfiguredDnd(Component)', () => {
  it('Renders its children', () => {
    const testText = 'Testing'

    function Sample () {
      return <div>{testText}</div>
    }

    const Wrapped = withConfiguredDnd(Sample)

    render(<Wrapped />)

    expect(screen.getByText(testText)).toBeInTheDocument()
  })

  it('Attaches some default props', () => {
    let propsPassed: any

    function Sample (props: withConfiguredDndAttachesPropTypes) {
      propsPassed = props
      return <div>Test</div>
    }

    const Wrapped = withConfiguredDnd(Sample)

    render(<Wrapped />)

    Object.entries(defaultValue).forEach(([key, value]) => {
      expect(propsPassed.configuredDnd[key]).toStrictEqual(value)
    })

    expect(propsPassed.configuredDnd.id).toBe('ID-123')
  })
})
