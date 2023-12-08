import NON_GROUPED_ITEMS_GROUP_NAME from './NON_GROUPED_ITEMS_GROUP_NAME'

import ItemGroups from './ItemGroups.type'

export const FIRST_CONTAINER_ID = 'firstGroup'
export const SECOND_CONTAINER_ID = 'secondGroup'

export const ITEM_1_BASE_ID = 'item-1'
export const ITEM_2_BASE_ID = 'item-2'
export const ITEM_3_BASE_ID = 'item-3'

export const ITEM_1_ITEM = 'This is some text'
export const ITEM_2_ITEM = 'This is more text'
export const ITEM_3_ITEM = {
  data: {
    a: 1,
    b: 2
  }
}

export const BASE_UNIQUE_ID = 'BASE_UNIQUE_ID'
export const baseGetUniqueId = () => BASE_UNIQUE_ID

export const getBaseItems = () => {
  const baseItems: ItemGroups = {
    [FIRST_CONTAINER_ID]: [
      {
        id: ITEM_1_BASE_ID,
        item: ITEM_1_ITEM
      }
    ],
    [SECOND_CONTAINER_ID]: [
      {
        id: ITEM_2_BASE_ID,
        item: ITEM_2_ITEM
      }
    ],
    [NON_GROUPED_ITEMS_GROUP_NAME]: [
      {
        id: ITEM_3_BASE_ID,
        item: ITEM_3_ITEM
      }
    ]
  }
  return baseItems
}
