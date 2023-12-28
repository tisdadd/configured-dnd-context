import React, { useState } from 'react'
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'

import { Coordinates } from '@dnd-kit/utilities'
import BasicDroppable from '../StoryComponents/BasicDroppable'

import attachesPropTypes from './withMakeDraggable.attachesPropTypes'
import withMakeDraggable from './withMakeDraggable'

import Square from '../StoryComponents/Square'
import ConfiguredDndProvider from '../ConfiguredDndProvider'
import SortableCollection from '../StoryComponents/SortableCollection'
import useConfiguredDnd from '../useConfiguredDnd'
import dndAllowableDropFilterSignature from '../ConfiguredDndProvider/util/dndAllowableDropFilterSignature.type'

const SquarePass = ({ dndExtras, ...otherProps }: attachesPropTypes) => {
  const {
    setNodeRef,
    style,
    attributes,
    listeners,
    setActivatorNodeRef,
    isDragging,
    inOverlay,
    isOver,
    activeNodeRect,
    activatorEvent,
    setDraggableNodeRef,
    setDroppableNodeRef,
    overIndex,
    isSorting,
    newIndex,
    activeIndex,
    ...rest
  } = dndExtras
  return (
    <Square
      setNodeRef={setNodeRef}
      style={{ ...style }}
      baseText='Square'
      {...otherProps}
      {...attributes}
      {...listeners}
      {...rest}
    />
  )
}

const InnerDragSquare = withMakeDraggable(SquarePass)

const SortableDragSquare = props => {
  return (
    <InnerDragSquare
      dndDraggable={{
        sortable: true,
        id: props.id,
        data: {
          ...props.data,
          dndCopy: props.dndCopy,
          dndMaintainOriginalId: true,
          dndDisallowContainerChanging: props.dndDisallowContainerChanging,
          extraText: props.extraText,
          ...(props.itemDataFunction ? props.itemDataFunction() : {})
        }
      }}
      {...props}
    />
  )
}

export default {
  component: InnerDragSquare
}

export const BasicDragNoDrop = () => {
  // this example we just want default sensors given - moving 25 px at a time if tabbed to.
  return (
    <ConfiguredDndProvider sensors={undefined}>
      <InnerDragSquare />
    </ConfiguredDndProvider>
  )
}

export const BasicAbsoluteDragCoordinates = () => {
  const [{ x, y }, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 })

  return (
    // this example we just want default sensors given - moving 25 px at a time if tabbed to.
    <ConfiguredDndProvider sensors={undefined}>
      <InnerDragSquare
        style={{
          position: 'absolute',
          top: y,
          left: x
        }}
        dndDraggable={{
          data: {
            onDragEnd: ({ delta }: DragEndEvent) => {
              setCoordinates(({ x: priorX, y: priorY }) => {
                return {
                  x: priorX + delta.x,
                  y: priorY + delta.y
                }
              })
            }
          }
        }}
      />
    </ConfiguredDndProvider>
  )
}

export const BasicSortableCollection = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection Component={SortableDragSquare} value={value} />
    </div>
  )
}

export const MoveBetweenMultipleSortableCollections = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='1-'
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='2-'
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='3-'
      />
    </div>
  )
}

export const CopyBetweenMultipleSortableCollections = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='1-'
        dndCopy={true}
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='2-'
        dndCopy={true}
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='3-'
        dndCopy={true}
      />
    </div>
  )
}

export const FirstContainerCopiesFromOthersMoveOnly = () => {
  const { id, ...value } = useConfiguredDnd()
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='1-'
        dndCopy={true}
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='2-'
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='3-'
      />
    </div>
  )
}

export const MultipleSortableContainersWithoutMovingBetweenThem = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='1-'
        dndDisallowContainerChanging={true}
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='2-'
        dndDisallowContainerChanging={true}
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='3-'
        dndDisallowContainerChanging={true}
      />
    </div>
  )
}

export const DragOnlyToContainerOneRight = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='1-'
        data={{
          dndDropToFilter: 1
        }}
        itemDataFunction={() => {
          const dndAllowableDropFilter: dndAllowableDropFilterSignature = ({
            containerId,
            containerData
          }) => {
            return containerData?.dndDropToFilter === 2
          }

          return {
            dndAllowableDropFilter
          }
        }}
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='2-'
        data={{
          dndDropToFilter: 2
        }}
        itemDataFunction={() => {
          const dndAllowableDropFilter: dndAllowableDropFilterSignature = ({
            containerId,
            containerData
          }) => {
            return containerData?.dndDropToFilter === 3
          }

          return {
            dndAllowableDropFilter
          }
        }}
      />
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='3-'
        data={{
          dndDropToFilter: 3
        }}
        itemDataFunction={() => {
          const dndAllowableDropFilter: dndAllowableDropFilterSignature = ({
            containerId,
            containerData
          }) => {
            return containerData?.dndDropToFilter === 1
          }

          return {
            dndAllowableDropFilter
          }
        }}
      />
    </div>
  )
}

export const SortableContainerWithDroppableContainer = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='1-'
      />
      <BasicDroppable value={value} />
    </div>
  )
}

export const SortableContainerWithAddAndRemoveDragAndDrops = () => {
  const [moved, setMoved] = useState<boolean>(false)
  const { id, ...value } = useConfiguredDnd()

  const { item } = value.getItem('DragCopy') || {
    item: {
      extraText: 1
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <InnerDragSquare
        dndDraggable={{
          sortable: true,
          id: 'DragCopy',
          nonGroupedItem: true,
          data: {
            dndCopy: true,
            dndMaintainOriginalId: true,
            onDragEnd: (dragEndEvent: DragEndEvent) => {
              value.updateItem('DragCopy', { extraText: item.extraText + 1 })
            },
            extraText: item.extraText || 1
          }
        }}
        extraText={`${item.extraText}`}
        value={value}
      />
      {!moved && (
        <InnerDragSquare
          dndDraggable={{
            sortable: true,
            extraText: `Move`,
            id: 'DragMove',
            nonGroupedItem: true,
            data: {
              onDragOver: (dragOverEvent: DragOverEvent) => {
                // we have moved to a sortable list
                if (
                  dragOverEvent.over &&
                  dragOverEvent.over?.data?.current?.sortable?.index > -1
                ) {
                  setMoved(true)
                }
              },
              onDragEnd: (dragEndEvent: DragEndEvent) => {
                // we ended on delete
                if (
                  dragEndEvent.over &&
                  ['DragMove', 'DragCopy'].indexOf(`${dragEndEvent.over?.id}`) <
                    0
                ) {
                  setMoved(true)
                }
              },
              extraText: 'Move'
            }
          }}
          extraText={`Move`}
          value={value}
        />
      )}
      <SortableCollection
        Component={SortableDragSquare}
        value={value}
        prefix='1-'
      />
      <BasicDroppable
        value={value}
        id='DropDelete'
        defaultText='Drop To Delete'
        style={{ borderColor: '#ff0000' }}
        data={{
          // don't change the text on drag over
          onDragOver: () => {},
          // delete from sortable container on drop
          onDrop: (dragEndEvent: DragEndEvent) => {
            if (dragEndEvent.active.id !== 'DragCopy') {
              value.removeItemOfId(dragEndEvent.active.id)
            }
          }
        }}
      />
    </div>
  )
}
