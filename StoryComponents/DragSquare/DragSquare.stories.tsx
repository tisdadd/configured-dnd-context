import type { Meta, StoryObj } from '@storybook/react'

import DragSquare from './DragSquare'

const meta: Meta<typeof DragSquare> = {
  component: DragSquare
}

export default meta

type Story = StoryObj<typeof DragSquare>

export const Default: Story = { args: {} }
