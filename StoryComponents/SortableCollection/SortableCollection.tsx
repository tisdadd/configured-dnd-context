import React, {
  useState,
  useEffect,
  ReactElement,
  ReactComponentElement
} from 'react'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import defaultValue from '../../ConfiguredDndContext.defaultValue'
import DragSquare from '../DragSquare'

type SortableCollectionProps = {
  value: typeof defaultValue
  prefix?: string
  dndCopy?: boolean
  dndDisallowContainerChanging?: boolean
  data?: any
  itemDataFunction?: () => any
}

const SortableCollection = ({
  value = defaultValue,
  prefix = '',
  dndCopy = false,
  dndDisallowContainerChanging = false,
  data = {},
  itemDataFunction = () => {
    return {}
  }
}: SortableCollectionProps) => {
  const { registerItemGroup, getItemGroup, getUniqueId } = value
  const [id] = useState('list-' + getUniqueId())
  const { setNodeRef } = useDroppable({ id })
  useEffect(() => {
    if (id) {
      registerItemGroup({
        id,
        items: [prefix + 'A', prefix + 'B', prefix + 'C', prefix + 'D'],
        data
      })
    }
  }, [id])

  const items = getItemGroup(id)

  let innards =
    items.length > 0
      ? items.map(({ id: squareId, item, copiedFromId }) => (
          <DragSquare
            key={squareId}
            extraText={item}
            id={squareId}
            value={value}
            sortable={true}
            dndCopy={dndCopy}
            copiedFromId={copiedFromId}
            dndDisallowContainerChanging={dndDisallowContainerChanging}
            // simple way to pass down further
            itemDataFunction={itemDataFunction}
          />
        ))
      : 'No Items'

  return (
    <SortableContext
      id={id}
      items={items.map(({ id }) => id)}
      strategy={rectSortingStrategy}
    >
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
