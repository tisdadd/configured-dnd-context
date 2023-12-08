import React from 'react'
import {
  render,
  screen
  // waitFor,
  // fireEvent
} from '@testing-library/react'
// import simulant from "simulant"

import ConfiguredDndContext from '../ConfiguredDndContext'
import defaultState from './ConfiguredDndProvider.defaultState'
import ConfiguredDndProvider from './ConfiguredDndProvider'

describe('<ConfiguredDndProvider />', () => {
  it('Renders its children', () => {
    const testText = 'Testing'

    render(
      <ConfiguredDndProvider>
        <div>{testText}</div>
      </ConfiguredDndProvider>
    )

    expect(screen.getByText(testText)).toBeInTheDocument()
  })

  it('Has some default values', () => {
    let valuePassed: any

    render(
      <ConfiguredDndProvider>
        <ConfiguredDndContext.Consumer>
          {value => {
            valuePassed = value
            return <div>Test</div>
          }}
        </ConfiguredDndContext.Consumer>
      </ConfiguredDndProvider>
    )

    Object.entries(defaultState).forEach(([key, value]) => {
      if (['itemGroups', 'itemGroupsData'].indexOf(key) < 0) {
        expect(valuePassed[key]).toStrictEqual(value)
      }
    })
  })

  it('Some of which may be overwritten by props', () => {
    let valuePassed: any
    const id = 'One'

    render(
      <ConfiguredDndProvider getUniqueId={() => id}>
        <ConfiguredDndContext.Consumer>
          {value => {
            valuePassed = value
            return <div>Test</div>
          }}
        </ConfiguredDndContext.Consumer>
      </ConfiguredDndProvider>
    )

    expect(valuePassed.getUniqueId()).toBe(id)
  })
  // most of the actual full behavior should be tested by playwright
})
