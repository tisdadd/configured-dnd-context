import React, { useState } from 'react'
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'

import ConfiguredDndProvider from './ConfiguredDndProvider'
import ConfiguredDndContext from '../ConfiguredDndContext'
import { Coordinates } from '@dnd-kit/utilities'
import DragSquare from '../StoryComponents/DragSquare'
import BasicDroppable from '../StoryComponents/BasicDroppable'
import SortableCollection from '../StoryComponents/SortableCollection'
import dndAllowableDropFilterSignature from './util/dndAllowableDropFilterSignature.type'

export default {
  component: ConfiguredDndProvider
}

export const BasicDragNoDrop = () => {
  return (
    <ConfiguredDndProvider sensors={undefined}>
      <ConfiguredDndContext.Consumer>
        {value => {
          return <DragSquare value={value} />
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const BasicAbsoluteDragCoordinates = () => {
  const [{ x, y }, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 })

  return (
    // this example we just want default sensors given - moving 25 px at a time if tabbed to.
    <ConfiguredDndProvider sensors={undefined}>
      <ConfiguredDndContext.Consumer>
        {value => {
          return (
            <DragSquare
              value={value}
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
          )
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const BasicSortableCollection = () => {
  return (
    <ConfiguredDndProvider>
      <ConfiguredDndContext.Consumer>
        {value => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <SortableCollection value={value} />
            </div>
          )
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const MoveBetweenMultipleSortableCollections = () => {
  return (
    <ConfiguredDndProvider>
      <ConfiguredDndContext.Consumer>
        {value => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <SortableCollection value={value} prefix='1-' />
              <SortableCollection value={value} prefix='2-' />
              <SortableCollection value={value} prefix='3-' />
            </div>
          )
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const CopyBetweenMultipleSortableCollections = () => {
  return (
    <ConfiguredDndProvider>
      <ConfiguredDndContext.Consumer>
        {value => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <SortableCollection value={value} prefix='1-' dndCopy={true} />
              <SortableCollection value={value} prefix='2-' dndCopy={true} />
              <SortableCollection value={value} prefix='3-' dndCopy={true} />
            </div>
          )
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const FirstContainerCopiesFromOthersMoveOnly = () => {
  return (
    <ConfiguredDndProvider>
      <ConfiguredDndContext.Consumer>
        {value => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <SortableCollection value={value} prefix='1-' dndCopy={true} />
              <SortableCollection value={value} prefix='2-' />
              <SortableCollection value={value} prefix='3-' />
            </div>
          )
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const MultipleSortableContainersWithoutMovingBetweenThem = () => {
  return (
    <ConfiguredDndProvider>
      <ConfiguredDndContext.Consumer>
        {value => {
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
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const DragOnlyToContainerOneRight = () => {
  return (
    <ConfiguredDndProvider>
      <ConfiguredDndContext.Consumer>
        {value => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <SortableCollection
                value={value}
                prefix='1-'
                data={{
                  dndDropToFilter: 1
                }}
                itemDataFunction={() => {
                  const dndAllowableDropFilter: dndAllowableDropFilterSignature =
                    ({ containerId, containerData }) => {
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
                  const dndAllowableDropFilter: dndAllowableDropFilterSignature =
                    ({ containerId, containerData }) => {
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
                  const dndAllowableDropFilter: dndAllowableDropFilterSignature =
                    ({ containerId, containerData }) => {
                      return containerData?.dndDropToFilter === 1
                    }

                  return {
                    dndAllowableDropFilter
                  }
                }}
              />
            </div>
          )
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const SortableContainerWithDroppableContainer = () => {
  return (
    <ConfiguredDndProvider>
      <ConfiguredDndContext.Consumer>
        {value => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <SortableCollection value={value} prefix='1-' />
              <BasicDroppable value={value} />
            </div>
          )
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}

export const SortableContainerWithAddAndRemoveDragAndDrops = () => {
  const [sample, setSample] = useState<number>(1)
  const [moved, setMoved] = useState<boolean>(false)

  return (
    <ConfiguredDndProvider>
      <ConfiguredDndContext.Consumer>
        {value => {
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
                      // we ended on delete
                      if (dragEndEvent.over?.id === 'DropDelete') {
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
        }}
      </ConfiguredDndContext.Consumer>
    </ConfiguredDndProvider>
  )
}
