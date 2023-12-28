import { DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import dndAllowableDropFilterSignature from './ConfiguredDndProvider/util/dndAllowableDropFilterSignature.type'

export { default as ConfiguredDndProvider } from './ConfiguredDndProvider'
export { default as withConfiguredDnd } from './withConfiguredDnd'
export { default as useConfiguredDnd } from './useConfiguredDnd'
export { default as withMakeDraggable } from './withMakeDraggable'
export { default as withMakeDroppable } from './withMakeDroppable'

export type { default as dndAllowableDropFilterSignature } from './ConfiguredDndProvider/util/dndAllowableDropFilterSignature.type'
export type { default as ContainerItem } from './ConfiguredDndProvider/util/ContainerItem.type'
export type { default as withMakeDraggableAttachesPropTypes } from './withMakeDraggable/withMakeDraggable.attachesPropTypes'
export type { default as withMakeDroppableAttachesPropTypes } from './withMakeDroppable/withMakeDroppable.attachesPropTypes'

/** Make it easy to see what type of data is available for draggable's */
export interface DraggableDataExtras {
  /** If true, this should copy to containers (SortableContext) when dropping to them, not just move */
  dndCopy?: boolean
  /** If true, this shouldn't be allowed to change what container it is in on drop*/
  dndDisallowContainerChanging?: boolean
  /** What to render to the overlay when this is the active item */
  renderOverlayItem?: () => React.JSX.Element
  /** Return true if this item is allowed to drop to the given container, false otherwise */
  dndAllowableDropFilter?: dndAllowableDropFilterSignature
  /**
   * Do you want to maintain this elements original id?
   * When copying an element via dndCopy, this leads to the overlay showing the item going back to where it came from.
   */
  dndMaintainOriginalId?: boolean
  /** What to do when this item moves over another - it is a hook into the DndContext onDragOver with this item
   * being the active one
   */
  onDragOver?: (dragOverEvent: DragOverEvent) => void
  /** What to do when this item is dropped - it is a hook into the DndContext onDragEnd with this item
   * being the active one */
  onDragEnd?: (dragEndEvent: DragEndEvent) => void
}

/** Make it easy to see what type of data is available for droppable's */
export interface DroppableDataExtras {
  /** What to do when this item has another move over it - it is a hook into the DndContext onDragOver with this item
   * being the over one
   */
  onDragOver?: (dragOverEvent: DragOverEvent) => void
  /** What to do when this item is dropped - it is a hook into the DndContext onDragEnd with this item being the over one */
  onDrop?: (dragEndEvent: DragEndEvent) => void
}
