import { UniqueIdentifier } from '@dnd-kit/core'

type ItemToGroupAndIndex = {
  [itemKey: UniqueIdentifier]:
    | {
        [groupKey: UniqueIdentifier]: number
      }
    | undefined
}
export default ItemToGroupAndIndex
