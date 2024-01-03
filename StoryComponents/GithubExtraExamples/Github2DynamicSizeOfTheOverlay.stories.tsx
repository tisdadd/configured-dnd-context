import type { Meta, StoryObj } from '@storybook/react'

import React, { useEffect, useMemo } from 'react'
import { useDroppable, UniqueIdentifier } from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useConfiguredDnd from '../../useConfiguredDnd'
import Square from '../Square'

type SortableCollectionProps = {
  prefix?: string
  data?: {
    elementStyle?: object
  }
}

type DragSquarePropTypes = {
  extraText?: string
  id: UniqueIdentifier
  copiedFromId?: UniqueIdentifier
  style?: object
}

const DragSquare = ({
  extraText,
  id,
  copiedFromId,
  style: extraStyle
}: DragSquarePropTypes) => {
  const { active } = useConfiguredDnd()

  const renderOverlayItem = ({
    value: { overContainerId, getItemGroupData }
  }) => {
    const itemGroupData = overContainerId
      ? getItemGroupData(overContainerId)
      : {}

    return (
      <Square
        style={{
          cursor: 'grabbing',
          borderWidth: '4px',
          borderColor: '#3f3f3f',
          ...(itemGroupData.elementStyle || {})
        }}
        extraText={extraText}
      />
    )
  }

  const hookParams = {
    id,
    data: {
      renderOverlayItem,
      extraText,
      dndCopy: true
    }
  }

  let { attributes, listeners, setNodeRef, transform, transition } =
    useSortable(hookParams)

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

function SortableCollection ({
  prefix = 'Square',
  data = {}
}: SortableCollectionProps) {
  const { registerItemGroup, getItemGroup, active, id } = useConfiguredDnd()
  const { setNodeRef } = useDroppable({ id })
  useEffect(() => {
    if (id) {
      let items = [prefix + 'A', prefix + 'B', prefix + 'C', prefix + 'D']
      registerItemGroup({
        id,
        items,
        data
      })
    }
  }, [id])

  const items = getItemGroup(id)

  const innards = useMemo(() => {
    return items.length > 0
      ? items.map(({ id: squareId, item, copiedFromId }) => (
          <DragSquare
            key={squareId}
            extraText={typeof item === 'string' ? item : item.extraText}
            id={squareId}
            copiedFromId={copiedFromId}
            style={data.elementStyle}
          />
        ))
      : 'No Items'
  }, [items, active?.id])

  const itemIds = useMemo(() => {
    return items.map(({ id }) => id)
  }, [items])

  return (
    <SortableContext
      id={`${id}`}
      items={itemIds}
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

function MultipleCollections () {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection prefix='1-' />
      <SortableCollection
        prefix='2-'
        data={{
          elementStyle: {
            width: '200px',
            height: '200px'
          }
        }}
      />
      <SortableCollection
        prefix='3-'
        data={{
          elementStyle: {
            width: '300px',
            height: '200px'
          }
        }}
      />
    </div>
  )
}

const meta: Meta<typeof DragSquare> = {
  component: MultipleCollections
}

export default meta

export const Default = {}
