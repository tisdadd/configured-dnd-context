import React, { useState } from 'react'
import {
  UniqueIdentifier,
  useDroppable,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core'

import defaultValue from '../../ConfiguredDndContext.defaultValue'

type BasicDroppableProps = {
  value: typeof defaultValue
  id?: UniqueIdentifier
  style?: object
  defaultText?: string
  data?: any
}

const BasicDroppable = ({
  value = defaultValue,
  id: propId = '',
  style = {},
  defaultText = 'Drop Here',
  data = {}
}: BasicDroppableProps) => {
  const { getUniqueId } = value

  const [id] = useState<UniqueIdentifier>(propId || getUniqueId())
  const [text, setText] = useState<string>(defaultText)
  const { setNodeRef, isOver, over } = useDroppable({
    id,
    data: {
      onDragOver: (dragOverEvent: DragOverEvent) => {
        setText(
          `Last Dragged Over Text is ${
            dragOverEvent.active.data?.current?.extraText ||
            'No Extra Text In Last Dragged Item'
          }`
        )
      },
      onDrop: (dragEndEvent: DragEndEvent) => {
        setText(
          dragEndEvent.active.data?.current?.extraText ||
            'No Extra Text In Last Dropped Item'
        )
      },
      ...data
    }
  })
  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: '15ch',
        minHeight: '15ch',
        borderColor: '#0000ff',
        borderWidth: isOver ? '3px' : '2px',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        ...style
      }}
    >
      <div>{text}</div>
    </div>
  )
}

export default BasicDroppable
