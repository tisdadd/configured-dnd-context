import React, { useEffect, useState } from 'react'
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { Coordinates } from '@dnd-kit/utilities'

import ConfiguredDndProvider from '../ConfiguredDndProvider'
import useConfiguredDnd from './useConfiguredDnd'

import DragSquare from '../StoryComponents/DragSquare'
import BasicDroppable from '../StoryComponents/BasicDroppable'
import SortableCollection from '../StoryComponents/SortableCollection'
import dndAllowableDropFilterSignature from '../ConfiguredDndProvider/util/dndAllowableDropFilterSignature.type'
import disableSortingStrategy from '../disableSortingStrategy'

export default {
  component: useConfiguredDnd
}

const InnerDragSquare = (props: any) => {
  const { id, ...value } = useConfiguredDnd()
  return <DragSquare value={value} id={id} {...props} />
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
        itemDataFunction={() => ({
          onDragEnd: ({ delta }: DragEndEvent) => {
            setCoordinates(({ x: priorX, y: priorY }) => {
              return {
                x: priorX + delta.x,
                y: priorY + delta.y
              }
            })
          }
        })}
      />
    </ConfiguredDndProvider>
  )
}

export const BasicSortableCollection = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection value={value} />
    </div>
  )
}

export const MoveBetweenMultipleSortableCollections = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection value={value} prefix='1-' />
      <SortableCollection value={value} prefix='2-' />
      <SortableCollection value={value} prefix='3-' />
    </div>
  )
}

export const CopyBetweenMultipleSortableCollections = () => {
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection value={value} prefix='1-' dndCopy={true} />
      <SortableCollection value={value} prefix='2-' dndCopy={true} />
      <SortableCollection value={value} prefix='3-' dndCopy={true} />
    </div>
  )
}

export const FirstContainerCopiesFromOthersMoveOnly = () => {
  const { id, ...value } = useConfiguredDnd()
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection
        value={value}
        dndMaintainOriginalId={true}
        prefix='1-'
        dndCopy={true}
      />
      <SortableCollection
        value={value}
        dndMaintainOriginalId={true}
        prefix='2-'
      />
      <SortableCollection
        value={value}
        dndMaintainOriginalId={true}
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
        value={value}
        prefix='1-'
        dndDisallowContainerChanging={true}
      />
      <SortableCollection
        value={value}
        prefix='2-'
        dndDisallowContainerChanging={true}
      />
      <SortableCollection
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
      <SortableCollection value={value} prefix='1-' />
      <BasicDroppable value={value} />
    </div>
  )
}

export const SortableContainerWithAddAndRemoveDragAndDrops = () => {
  const [sample, setSample] = useState<number>(1)
  const [moved, setMoved] = useState<boolean>(false)
  const { id, ...value } = useConfiguredDnd()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <DragSquare
        sortable={true}
        dndCopy={true}
        dndMaintainOriginalId={true}
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

export const DifferentSizedElements = () => {
  const { id, ...value } = useConfiguredDnd()
  useEffect(() => {
    if (id) {
      let items = ['A', 'B', 'C', 'D']
      value.registerItemGroup({
        id,
        items
      })
    }
  }, [id])

  const items = value.getItemGroup(id)

  const itemIds = items.map(({ id }) => id)

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableContext
        id={`${id}`}
        items={itemIds}
        strategy={disableSortingStrategy}
      >
        <div
          style={{
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: '#00ef00'
          }}
        >
          {items.map(({ item, id: squareId }) => {
            let style = {
              height: '10ch'
            }
            switch (item) {
              case 'B':
                style.height = '15ch'
                break
              case 'C':
                style.height = '20ch'
                break
              case 'D':
                style.height = '25ch'
                break
              default: // do nothing
            }

            return (
              <DragSquare
                key={squareId}
                value={value}
                style={style}
                renderExtraStyle={style}
                extraText={item}
                sortable={true}
                id={squareId}
                itemDataFunction={() => {
                  return {
                    dndSwapPositionsWhileMoving: true
                  }
                }}
              />
            )
          })}
        </div>
      </SortableContext>
    </div>
  )
}
