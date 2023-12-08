import { Active, UniqueIdentifier } from '@dnd-kit/core'
import NON_GROUPED_ITEMS_GROUP_NAME from './util/NON_GROUPED_ITEMS_GROUP_NAME'

type StateType = {
  active: Active | null
  itemGroups: {
    [key: string]: any[]
  }
  itemGroupsData: {
    [key: string]: any
  }
}

const defaultState: StateType = {
  active: null,
  itemGroups: { [NON_GROUPED_ITEMS_GROUP_NAME]: [] },
  itemGroupsData: {}
}

export default defaultState
