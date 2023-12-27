import { UniqueIdentifier } from '@dnd-kit/core'
import defaultState from './ConfiguredDndProvider/ConfiguredDndProvider.defaultState'

import RegisterItemGroupTypeFunctionParameters from './ConfiguredDndProvider/util/RegisterItemGroupTypeFunctionParameters.type'
import ContainerItem from './ConfiguredDndProvider/util/ContainerItem.type'

const { itemGroups, itemGroupsData, ...remainingState } = defaultState

export default {
  ...remainingState,
  registerItemGroup: (input: RegisterItemGroupTypeFunctionParameters) => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - received ${JSON.stringify(
        input
      )}`
    )
  },
  getItemGroup: (id: UniqueIdentifier) => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - received ${id}`
    )
    return [] as ContainerItem[]
  },
  getItemGroupData: (id: UniqueIdentifier) => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - received ${id}`
    )
    return null as any
  },
  getUniqueId: () => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - returning lame id`
    )
    return 'ID-123' as UniqueIdentifier
  },
  removeItemOfId: (id: UniqueIdentifier) => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - received ${id}`
    )
  },
  registerNonGroupedItem: (id: UniqueIdentifier, item: any) => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - received ${id} and ${JSON.stringify(
        item
      )}`
    )
  },
  getNonGroupedItem: (id: UniqueIdentifier) => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - received ${id}`
    )
    return { id: '123', item: 'test' } as ContainerItem | null
  },
  updateItem: (id: UniqueIdentifier, item: any) => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - received ${id}, ${item}`
    )
  },
  getItem: (id: UniqueIdentifier) => {
    console.log(
      `Please wrap in ConfiguredDndProvider for real functionality - received ${id}`
    )
    return { id: '123', item: 'test' } as ContainerItem | null
  }
}
