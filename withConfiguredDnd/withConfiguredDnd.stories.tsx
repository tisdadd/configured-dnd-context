import React, { useState } from 'react'
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'

import ConfiguredDndProvider from '../ConfiguredDndProvider'
import withConfiguredDnd from './withConfiguredDnd'

import { Coordinates } from '@dnd-kit/utilities'
import DragSquare from '../StoryComponents/DragSquare'
import BasicDroppable from '../StoryComponents/BasicDroppable'
import SortableCollection from '../StoryComponents/SortableCollection'
import dndAllowableDropFilterSignature from '../ConfiguredDndProvider/util/dndAllowableDropFilterSignature.type'

export default {
  component: withConfiguredDnd
}

const InnerDragSquare = (props: any) => {
  const {
    configuredDnd: { id, ...value },
    ...rest
  } = props
  return <DragSquare value={value} id={id} {...rest} />
}

const OuterDragSquare = withConfiguredDnd(InnerDragSquare)

export const BasicDragNoDrop = () => {
  // this example we just want default sensors given - moving 25 px at a time if tabbed to.
  return (
    <ConfiguredDndProvider sensors={undefined}>
      <OuterDragSquare />
    </ConfiguredDndProvider>
  )
}

export const BasicAbsoluteDragCoordinates = () => {
  const [{ x, y }, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 })

  return (
    // this example we just want default sensors given - moving 25 px at a time if tabbed to.
    <ConfiguredDndProvider sensors={undefined}>
      <OuterDragSquare
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

export const BasicSortableCollection = withConfiguredDnd(props => {
  const {
    configuredDnd: { id, ...value },
    ...rest
  } = props

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <SortableCollection value={value} />
    </div>
  )
})

export const MoveBetweenMultipleSortableCollections = withConfiguredDnd(
  props => {
    const {
      configuredDnd: { id, ...value },
      ...rest
    } = props

    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <SortableCollection value={value} prefix='1-' />
        <SortableCollection value={value} prefix='2-' />
        <SortableCollection value={value} prefix='3-' />
      </div>
    )
  }
)

export const CopyBetweenMultipleSortableCollections = withConfiguredDnd(
  props => {
    const {
      configuredDnd: { id, ...value },
      ...rest
    } = props

    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <SortableCollection value={value} prefix='1-' dndCopy={true} />
        <SortableCollection value={value} prefix='2-' dndCopy={true} />
        <SortableCollection value={value} prefix='3-' dndCopy={true} />
      </div>
    )
  }
)

export const FirstContainerCopiesFromOthersMoveOnly = withConfiguredDnd(
  props => {
    const {
      configuredDnd: { id, ...value },
      ...rest
    } = props
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <SortableCollection value={value} prefix='1-' dndCopy={true} />
        <SortableCollection value={value} prefix='2-' />
        <SortableCollection value={value} prefix='3-' />
      </div>
    )
  }
)

export const MultipleSortableContainersWithoutMovingBetweenThem =
  withConfiguredDnd(props => {
    const {
      configuredDnd: { id, ...value },
      ...rest
    } = props

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
  })

export const DragOnlyToContainerOneRight = withConfiguredDnd(props => {
  const {
    configuredDnd: { id, ...value },
    ...rest
  } = props

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
})

export const SortableContainerWithDroppableContainer = withConfiguredDnd(
  props => {
    const {
      configuredDnd: { id, ...value },
      ...rest
    } = props

    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <SortableCollection value={value} prefix='1-' />
        <BasicDroppable value={value} />
      </div>
    )
  }
)

export const SortableContainerWithAddAndRemoveDragAndDrops = withConfiguredDnd(
  props => {
    const {
      configuredDnd: { id, ...value },
      ...rest
    } = props
    const [sample, setSample] = useState<number>(1)
    const [moved, setMoved] = useState<boolean>(false)

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
                // we ended on someplace we are allowed to drop
                if (
                  dragEndEvent.over &&
                  ['DragMove', 'DragCopy'].indexOf(`${dragEndEvent.over?.id}`) <
                    0
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
)
