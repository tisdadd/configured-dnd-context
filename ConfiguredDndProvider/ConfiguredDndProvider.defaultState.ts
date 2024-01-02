import { Active, UniqueIdentifier } from '@dnd-kit/core'
import NON_GROUPED_ITEMS_GROUP_NAME from './util/NON_GROUPED_ITEMS_GROUP_NAME'
import ItemToGroupAndIndex from './util/ItemToGroupAndIndex.type'

type StateType = {
  active: Active | null
  itemGroups: {
    itemGroups: { [key: string]: any[] }
    itemsToGroupMapping: ItemToGroupAndIndex
  }
  itemGroupsData: {
    [key: string]: any
  }
  overContainerId: UniqueIdentifier | null
}

const defaultState: StateType = {
  active: null,
  itemGroups: {
    itemGroups: { [NON_GROUPED_ITEMS_GROUP_NAME]: [] },
    itemsToGroupMapping: {}
  },
  itemGroupsData: {},
  overContainerId: null
}

export default defaultState
