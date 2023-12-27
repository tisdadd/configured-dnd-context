import React from 'react'
import { StoryObj } from '@storybook/react'

import attachesPropTypes from './withMakeDroppable.attachesPropTypes'
import withMakeDroppable from './withMakeDroppable'

import Square from '../StoryComponents/Square'

const DroppableSquare = ({
  dndExtras: { setNodeRef, style }
}: attachesPropTypes) => {
  return <Square style={style} setNodeRef={setNodeRef} baseText='Drop Here' />
}

export default {
  component: withMakeDroppable(DroppableSquare)
}

export const Default: StoryObj<typeof withMakeDroppable> = {}
