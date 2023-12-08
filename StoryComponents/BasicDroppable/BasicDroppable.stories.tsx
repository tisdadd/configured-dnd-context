import type { Meta, StoryObj } from '@storybook/react'

import BasicDroppable from './BasicDroppable'

const meta: Meta<typeof BasicDroppable> = {
  component: BasicDroppable
}

export default meta

type Story = StoryObj<typeof BasicDroppable>

export const Default: Story = { args: {} }
