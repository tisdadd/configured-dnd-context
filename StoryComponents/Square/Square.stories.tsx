import type { Meta, StoryObj } from '@storybook/react'

import Square from './Square'

const meta: Meta<typeof Square> = {
  component: Square
}

export default meta

type Story = StoryObj<typeof Square>

export const Default: Story = { args: { extraText: 'Not Active' } }
