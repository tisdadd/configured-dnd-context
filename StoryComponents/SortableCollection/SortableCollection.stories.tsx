import type { Meta, StoryObj } from '@storybook/react'

import SortableCollection from './SortableCollection'

const meta: Meta<typeof SortableCollection> = {
  component: SortableCollection
}

export default meta

type Story = StoryObj<typeof SortableCollection>

export const Default: Story = { args: {} }
