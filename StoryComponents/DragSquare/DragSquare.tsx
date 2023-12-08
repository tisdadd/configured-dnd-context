import React, { useState, useEffect } from 'react'

import Square from '../Square'

import defaultValue from '../../ConfiguredDndContext.defaultValue'
import { useDraggable, UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type DragSquarePropTypes = {
  value: typeof defaultValue
  extraText?: string
  id?: UniqueIdentifier
  sortable?: boolean
  dndCopy?: boolean
  dndDisallowContainerChanging?: boolean
  copiedFromId?: UniqueIdentifier
  itemDataFunction?: () => any
  selfContained?: boolean
  style?: object
}

const DragSquare = ({
  value = defaultValue,
  extraText,
  id: propId,
  sortable,
  dndCopy,
  dndDisallowContainerChanging,
  copiedFromId,
  itemDataFunction,
  selfContained = false,
  style: extraStyle
}: DragSquarePropTypes) => {
  const { getUniqueId, active, registerNonGroupedItem, getNonGroupedItem } =
    value

  // per the underlying dnd-kit still need a unique id
  let [id] = useState<UniqueIdentifier>(propId || getUniqueId())

  const renderOverlayItem = () => {
    return (
      <Square
        style={{
          cursor: 'grabbing',
          borderWidth: '4px',
          borderColor: '#3f3f3f'
        }}
        extraText={extraText}
      />
    )
  }

  let extraItemData: { [key: string]: any } = {}
  if (itemDataFunction) {
    extraItemData = itemDataFunction()
  }

  useEffect(() => {
    if (selfContained) {
      registerNonGroupedItem(id, extraText)
    }
  }, [id, selfContained, extraText])

  if (selfContained) {
    const item = getNonGroupedItem(id)
    if (item) {
      id = item.id
    }
  }

  const hookParams = {
    id,
    data: {
      renderOverlayItem,
      dndCopy,
      dndDisallowContainerChanging,
      extraText,
      ...extraItemData
    }
  }

  // dnd-kit draggable stuff

  // was a destructure but typescript didn't like
  let attributes, listeners, setNodeRef, transform, transition

  if (sortable) {
    const hookBase = useSortable(hookParams)
    attributes = hookBase.attributes
    listeners = hookBase.listeners
    setNodeRef = hookBase.setNodeRef
    transform = hookBase.transform
    transition = hookBase.transition
  } else {
    const hookBase = useDraggable(hookParams)
    attributes = hookBase.attributes
    listeners = hookBase.listeners
    setNodeRef = hookBase.setNodeRef
    transform = hookBase.transform
  }

  const styleBaseAsActive =
    active?.id === id || (active?.id && active?.id === copiedFromId)

  // dnd-kit gives us the basic styles
  const style = {
    ...extraStyle,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: styleBaseAsActive ? 0.5 : 1,
    cursor: styleBaseAsActive ? 'grabbing' : 'grab'
  }

  return (
    <Square
      setNodeRef={setNodeRef}
      style={style}
      extraText={extraText}
      {...attributes}
      {...listeners}
    />
  )
}

export default DragSquare
