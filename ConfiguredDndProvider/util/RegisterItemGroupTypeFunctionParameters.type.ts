import { UniqueIdentifier } from '@dnd-kit/core'

type RegisterItemGroupTypeFunctionParameters = {
  /**
   * A unique id for this item group
   */
  id: UniqueIdentifier
  /**
   * Item data for this - will have ids attached and items put into item
   * Example: original = ['a', {b:1}] output = [{id: 1, item: 'a'}, {id: 2, item: {b:1}}]
   */
  items: any[]
  /**
   * itemPrefix: A prefix for the item ids
   */
  itemPrefix?: string
  /**
   * Data specific to this item group
   */
  data?: any
  /**
   * Items are already in container item format ({id, item})
   */
  itemsAreContainerItems?: boolean
}

export default RegisterItemGroupTypeFunctionParameters
