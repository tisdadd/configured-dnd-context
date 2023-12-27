import { UniqueIdentifier } from '@dnd-kit/core'
import defaultState from './ConfiguredDndProvider/ConfiguredDndProvider.defaultState'

import RegisterItemGroupTypeFunctionParameters from './ConfiguredDndProvider/util/RegisterItemGroupTypeFunctionParameters.type'
import ContainerItem from './ConfiguredDndProvider/util/ContainerItem.type'

const { itemGroups, itemGroupsData, ...remainingState } = defaultState

export default {
  ...remainingState,
  registerItemGroup: (input: RegisterItemGroupTypeFunctionParameters) => {},
  getItemGroup: (id: UniqueIdentifier) => {
    return [] as ContainerItem[]
  },
  getItemGroupData: (id: UniqueIdentifier) => {
    return null as any
  },
  getUniqueId: () => {
    return 'OverlayItem' as UniqueIdentifier
  },
  removeItemOfId: (id: UniqueIdentifier) => {},
  registerNonGroupedItem: (id: UniqueIdentifier, item: any) => {},
  getNonGroupedItem: (id: UniqueIdentifier) => {
    return { id: '123', item: 'test' } as ContainerItem | null
  },
  updateItem: (id: UniqueIdentifier, item: any) => {},
  getItem: (id: UniqueIdentifier) => {
    return { id: '123', item: 'test' } as ContainerItem | null
  }
}
