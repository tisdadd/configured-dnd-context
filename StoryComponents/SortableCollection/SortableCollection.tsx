import React, { useState, useEffect, ComponentType, useMemo } from 'react'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import defaultValue from '../../ConfiguredDndContext.defaultValue'
import DragSquare from '../DragSquare'

type SortableCollectionProps = {
  value: typeof defaultValue
  prefix?: string
  dndCopy?: boolean
  dndDisallowContainerChanging?: boolean
  dndMaintainOriginalId?: boolean
  data?: any
  itemDataFunction?: () => any
  Component?: ComponentType<P>
  numberOfElements?: number
}

const SortableCollection = <P extends object>({
  value = defaultValue,
  prefix = '',
  dndCopy = false,
  dndDisallowContainerChanging = false,
  dndMaintainOriginalId,
  data = {},
  itemDataFunction = () => {
    return {}
  },
  Component = DragSquare,
  numberOfElements
}: SortableCollectionProps) => {
  const { registerItemGroup, getItemGroup, getUniqueId } = value
  const [id] = useState('list-' + getUniqueId())
  const { setNodeRef } = useDroppable({ id })
  useEffect(() => {
    if (id) {
      let items = [prefix + 'A', prefix + 'B', prefix + 'C', prefix + 'D']
      if (numberOfElements) {
        items = [...items, ...Array(numberOfElements)]
        for (let i = 4; i < items.length; i++) {
          items[i] = prefix + i
        }
      }
      registerItemGroup({
        id,
        items,
        data
      })
    }
  }, [id, numberOfElements])

  const items = getItemGroup(id)

  const innards =
    items.length > 0
      ? items.map(({ id: squareId, item, copiedFromId }) => (
          <Component
            key={squareId}
            extraText={typeof item === 'string' ? item : item.extraText}
            id={squareId}
            value={value}
            sortable={true}
            dndCopy={dndCopy}
            dndMaintainOriginalId={dndMaintainOriginalId}
            copiedFromId={copiedFromId}
            dndDisallowContainerChanging={dndDisallowContainerChanging}
            // simple way to pass down further
            itemDataFunction={itemDataFunction}
          />
        ))
      : 'No Items'

  const itemIds = items.map(({ id }) => id)

  return (
    <SortableContext id={id} items={itemIds} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        style={{
          borderStyle: 'solid',
          borderWidth: '2px',
          borderColor: '#00ef00'
        }}
      >
        {innards}
      </div>
    </SortableContext>
  )
}

export default SortableCollection
