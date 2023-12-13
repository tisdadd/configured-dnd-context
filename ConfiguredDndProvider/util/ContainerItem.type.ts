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
  /**What container was this copied to */
  copiedFromContainer?: UniqueIdentifier
  /** what was this items original id, or new id depending upon direction copied */
  originalId?: UniqueIdentifier
}

export default ContainerItem
