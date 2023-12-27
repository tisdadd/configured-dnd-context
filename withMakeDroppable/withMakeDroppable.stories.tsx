import React, { useState } from 'react'
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'

import useConfiguredDnd from '../useConfiguredDnd'

import Square from '../StoryComponents/Square'
import DragSquare from '../StoryComponents/DragSquare'
import SortableCollection from '../StoryComponents/SortableCollection'
import attachesPropTypes from './withMakeDroppable.attachesPropTypes'

import withMakeDroppable from './withMakeDroppable'

export default {
  component: useConfiguredDnd
}

const SquarePass = ({ dndExtras, ...otherProps }: attachesPropTypes) => {
  const { setNodeRef, ...rest } = dndExtras
  const style = rest.isOver ? { backgroundColor: '#3d3d3d' } : {}
  return (
    <Square
      setNodeRef={setNodeRef}
      style={{ ...style, cursor: '', paddingTop: 0 }}
      {...otherProps}
      {...rest}
    />
  )
}

const InnerDropSquare = withMakeDroppable(SquarePass)

export const SortableContainerWithDroppableContainer = () => {
  const { id, ...value } = useConfiguredDnd()

  const { item } = value.getItem('DropZone') || { item: { text: 'Drop Here' } }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection value={value} prefix='1-' />
      <InnerDropSquare
        baseText={item.text || 'Drop Here'}
        dndDroppable={{
          id: 'DropZone',
          data: {
            onDragOver: (dragOverEvent: DragOverEvent) => {
              const newItem = {
                ...item,
                text: `Last Dragged Over Text is ${
                  dragOverEvent.active.data?.current?.extraText ||
                  'No Extra Text In Last Dragged Item'
                }`
              }
              value.updateItem('DropZone', newItem)
            },
            onDrop: (dragEndEvent: DragEndEvent) => {
              value.updateItem('DropZone', {
                ...item,
                text:
                  dragEndEvent.active.data?.current?.extraText ||
                  'No Extra Text In Last Dropped Item'
              })
            }
          },
          text: 'Drop Here'
        }}
        value={value}
      />
    </div>
  )
}

export const SortableContainerWithAddAndRemoveDragAndDrops = () => {
  const [sample, setSample] = useState<number>(1)
  const [moved, setMoved] = useState<boolean>(false)
  const { id, ...value } = useConfiguredDnd()

  const { item } = value.getItem('DropZone') || { item: { text: 'Drop Here' } }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <DragSquare
        sortable={true}
        dndCopy={true}
        extraText={`${sample}`}
        value={value}
        id='DragCopy'
        selfContained={true}
        itemDataFunction={() => ({
          onDragEnd: () => {
            setSample(sample + 1)
          }
        })}
      />
      {!moved && (
        <DragSquare
          sortable={true}
          extraText={`Move`}
          value={value}
          id='DragMove'
          selfContained={true}
          itemDataFunction={() => ({
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
              if (
                dragEndEvent.over &&
                ['DragMove', 'DragCopy'].indexOf(`${dragEndEvent.over?.id}`) < 0
              ) {
                setMoved(true)
              }
            }
          })}
        />
      )}
      <SortableCollection value={value} prefix='1-' />

      <InnerDropSquare
        baseText={item.text || 'Drop To Delete'}
        dndDroppable={{
          id: 'DropZone',
          data: {
            onDrop: (dragEndEvent: DragEndEvent) => {
              if (dragEndEvent.active.id !== 'DragCopy') {
                value.removeItemOfId(dragEndEvent.active.id)
              }
            }
          },
          text: 'Drop To Delete'
        }}
        value={value}
      />
    </div>
  )
}
