import React from 'react'
import { ConfiguredDndProvider } from '../index'
import './global.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: [],
      locales: ''
    }
  }
}

export const decorators = [
  Story => (
    <ConfiguredDndProvider>
      <Story />
    </ConfiguredDndProvider>
  )
]
