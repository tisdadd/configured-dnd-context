import React from 'react'
import { render } from '@testing-library/react'

import defaultValue from '../ConfiguredDndContext.defaultValue'
import useConfiguredDnd from './useConfiguredDnd'

describe('useConfiguredDnd() Hook', () => {
  it('Gives some default values including an id', () => {
    let valuesGiven: any

    function Sample () {
      valuesGiven = useConfiguredDnd()
      return <div>Test</div>
    }

    render(<Sample />)

    Object.entries(defaultValue).forEach(([key, value]) => {
      expect(valuesGiven[key]).toStrictEqual(value)
    })
    // from the defaultValue
    expect(valuesGiven.id).toBe('ID-123')
  })
})
