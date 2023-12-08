import { UniqueIdentifier } from '@dnd-kit/core'

/** an item in a container or item group */
type ContainerItem = {
  /** the basic id */
  id: UniqueIdentifier
  /** the actual item information */
  item?: any
  /** was this copied from another id at some point */
  copiedFromId?: UniqueIdentifier
  /**What container was this copied to */
  copiedToContainer?: UniqueIdentifier
  /** what was this items original id */
  originalId?: UniqueIdentifier
}

export default ContainerItem
