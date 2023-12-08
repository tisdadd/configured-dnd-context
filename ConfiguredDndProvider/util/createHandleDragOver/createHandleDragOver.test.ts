import { Active, DragOverEvent, UniqueIdentifier } from '@dnd-kit/core'
import { Dispatch, SetStateAction } from 'react'

import { expect, jest, describe, it } from '@jest/globals'

import createHandleDragOver from '.'

import NON_GROUPED_ITEMS_GROUP_NAME from '../NON_GROUPED_ITEMS_GROUP_NAME'
import ItemGroups from '../ItemGroups.type'

import {
  FIRST_CONTAINER_ID,
  SECOND_CONTAINER_ID,
  ITEM_1_BASE_ID,
  ITEM_3_BASE_ID,
  getBaseItems,
  baseGetUniqueId,
  BASE_UNIQUE_ID
} from '../testBasics'

type onDragOverSignature = (dragEndEvent: DragOverEvent) => void
type getItemGroupDataSignature = (id: UniqueIdentifier) => any

const basicActive: Active = {
  id: ITEM_1_BASE_ID,
  data: {
    current: {}
  }
} as unknown as Active

describe('createHandleDragOver', () => {
  let setItemGroups: Dispatch<SetStateAction<ItemGroups>>
  let setLastOverContainerId: Dispatch<SetStateAction<UniqueIdentifier | null>>
  let getItemGroupData: getItemGroupDataSignature

  beforeEach(() => {
    setItemGroups = jest.fn()
    setLastOverContainerId = jest.fn()
    getItemGroupData = jest.fn<getItemGroupDataSignature>()
  })

  it("Calls the passed in active and over's data.current.onDragOver if it exists", () => {
    const onDragOver = jest.fn<onDragOverSignature>()
    const onDragOver2 = jest.fn<onDragOverSignature>()

    const handleDragOver = createHandleDragOver({
      setItemGroups,
      lastOverContainerId: FIRST_CONTAINER_ID,
      setLastOverContainerId,
      dragStartContainerId: FIRST_CONTAINER_ID,
      getItemGroupData,
      active: basicActive,
      getUniqueId: () => 'New ID'
    })

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            onDragOver
          }
        }
      },
      over: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            onDragOver: onDragOver2
          }
        }
      }
    } as unknown as DragOverEvent)

    expect(onDragOver).toBeCalled()
    expect(onDragOver2).toBeCalled()
  })

  it('If not over something, cleans up copiedFromId and copiedToContainer, restoring to original id if dndCopy is true', () => {
    const id = 'CopiedId'
    let testItems = getBaseItems()
    testItems[SECOND_CONTAINER_ID].push({
      ...testItems[FIRST_CONTAINER_ID][0]
    })
    testItems[FIRST_CONTAINER_ID][0] = {
      ...testItems[FIRST_CONTAINER_ID][0],
      id,
      copiedFromId: ITEM_1_BASE_ID,
      copiedToContainer: SECOND_CONTAINER_ID
    }
    testItems[SECOND_CONTAINER_ID].push()

    let testSetItemGroupsSpy
    let testSetItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testSetItemGroupsSpy = jest.fn(setItemGroupsFunction)

          testItems = testSetItemGroupsSpy(testItems)
        }
      }
    )

    let testSetLastOverContainerIdSpy
    let lastOverContainerId: UniqueIdentifier | null = SECOND_CONTAINER_ID
    let testSetLastOverContainerId = jest.fn<
      Dispatch<SetStateAction<UniqueIdentifier | null>>
    >(setLastOverContainerIdFunction => {
      if (typeof setLastOverContainerIdFunction === 'function') {
        testSetLastOverContainerIdSpy = jest.fn(setLastOverContainerIdFunction)

        lastOverContainerId = testSetLastOverContainerIdSpy(lastOverContainerId)
      }
    })

    const handleDragOver = createHandleDragOver({
      setItemGroups: testSetItemGroups,
      lastOverContainerId: SECOND_CONTAINER_ID,
      setLastOverContainerId: testSetLastOverContainerId,
      dragStartContainerId: FIRST_CONTAINER_ID,
      getItemGroupData,
      active: {
        ...basicActive,
        data: {
          current: {
            dndCopy: true
          }
        }
      },
      getUniqueId: () => 'New ID'
    })

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              index: 1
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    expect(testSetItemGroupsSpy).lastReturnedWith(getBaseItems())
  })

  it('Will not call setItemGroups if conditions are not met', () => {
    let handleDragOver = createHandleDragOver({
      setItemGroups,
      lastOverContainerId: SECOND_CONTAINER_ID,
      setLastOverContainerId,
      dragStartContainerId: FIRST_CONTAINER_ID,
      getItemGroupData,
      active: {
        ...basicActive,
        data: {
          current: {
            dndCopy: true
          }
        }
      },
      getUniqueId: () => 'New ID'
    })

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID
            }
          }
        }
      },
      over: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID
            },
            dndDisallowContainerChanging: true
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    expect(setItemGroups).toBeCalledTimes(0)

    // these conditions are correct to call
    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID
            }
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    expect(setItemGroups).toBeCalledTimes(1)

    handleDragOver = createHandleDragOver({
      setItemGroups,
      lastOverContainerId: SECOND_CONTAINER_ID,
      setLastOverContainerId,
      dragStartContainerId: FIRST_CONTAINER_ID,
      getItemGroupData,
      active: {
        ...basicActive,
        data: {
          current: {
            dndAllowableDropFilter: () => {
              return false
            }
          }
        }
      },
      getUniqueId: () => 'New ID'
    })

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID
            }
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    // keeping the one call from prior good conditions
    expect(setItemGroups).toBeCalledTimes(1)
  })

  it('Will set the last active container id', () => {
    let testSetLastOverContainerIdSpy
    let lastOverContainerId: UniqueIdentifier | null = FIRST_CONTAINER_ID
    let testSetLastOverContainerId = jest.fn<
      Dispatch<SetStateAction<UniqueIdentifier | null>>
    >(setLastOverContainerIdFunction => {
      if (typeof setLastOverContainerIdFunction === 'function') {
        testSetLastOverContainerIdSpy = jest.fn(setLastOverContainerIdFunction)

        lastOverContainerId = testSetLastOverContainerIdSpy(lastOverContainerId)
      }
    })

    let handleDragOver = createHandleDragOver({
      setItemGroups,
      lastOverContainerId: SECOND_CONTAINER_ID,
      setLastOverContainerId: testSetLastOverContainerId,
      dragStartContainerId: FIRST_CONTAINER_ID,
      getItemGroupData,
      active: {
        ...basicActive,
        data: {
          current: {
            dndCopy: true
          }
        }
      },
      getUniqueId: () => 'New ID'
    })

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              index: 1
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    expect(testSetLastOverContainerIdSpy).lastReturnedWith(null)

    handleDragOver = createHandleDragOver({
      setItemGroups,
      lastOverContainerId: FIRST_CONTAINER_ID,
      setLastOverContainerId: testSetLastOverContainerId,
      dragStartContainerId: FIRST_CONTAINER_ID,
      getItemGroupData,
      active: {
        ...basicActive,
        data: {
          current: {
            dndCopy: true
          }
        }
      },
      getUniqueId: () => 'New ID'
    })

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID
            }
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    expect(testSetLastOverContainerIdSpy).lastReturnedWith(SECOND_CONTAINER_ID)
  })

  it('Over a container and not set to copy, will simply move there', () => {
    const id = 'CopiedId'
    let testItems = getBaseItems()
    let testSetItemGroupsSpy
    let testSetItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testSetItemGroupsSpy = jest.fn(setItemGroupsFunction)
          testItems = testSetItemGroupsSpy(testItems)
        }
      }
    )

    const handleDragOver = createHandleDragOver({
      setItemGroups: testSetItemGroups,
      lastOverContainerId: SECOND_CONTAINER_ID,
      setLastOverContainerId,
      dragStartContainerId: FIRST_CONTAINER_ID,
      getItemGroupData,
      active: basicActive,
      getUniqueId: () => 'New ID'
    })

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID,
              index: 0
            }
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 1
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    const expectedItems = getBaseItems()
    expectedItems[SECOND_CONTAINER_ID].push(
      expectedItems[FIRST_CONTAINER_ID][0]
    )
    expectedItems[FIRST_CONTAINER_ID].splice(0, 1)

    expect(testSetItemGroupsSpy).lastReturnedWith(expectedItems)
  })

  it('Over a container and set to copy, will copy there updating data', () => {
    const id = 'CopiedId'
    let testItems = getBaseItems()
    let testSetItemGroupsSpy
    let testSetItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testSetItemGroupsSpy = jest.fn(setItemGroupsFunction)
          testItems = testSetItemGroupsSpy(testItems)
        }
      }
    )

    const handleDragOver = createHandleDragOver({
      setItemGroups: testSetItemGroups,
      lastOverContainerId: SECOND_CONTAINER_ID,
      setLastOverContainerId,
      dragStartContainerId: FIRST_CONTAINER_ID,
      getItemGroupData,
      active: {
        ...basicActive,
        data: {
          current: {
            dndCopy: true
          }
        }
      },
      getUniqueId: () => id
    })

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID,
              index: 0
            }
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 1
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    const expectedItems = getBaseItems()
    expectedItems[SECOND_CONTAINER_ID].push(
      expectedItems[FIRST_CONTAINER_ID][0]
    )
    expectedItems[FIRST_CONTAINER_ID][0] = {
      ...expectedItems[FIRST_CONTAINER_ID][0],
      copiedFromId: expectedItems[FIRST_CONTAINER_ID][0].id,
      copiedToContainer: SECOND_CONTAINER_ID,
      id
    }

    expect(testSetItemGroupsSpy).lastReturnedWith(expectedItems)
  })

  it('If copying, and straight from another container, will clean up', () => {
    const id = 'CopiedId'
    let idCounter = 0

    const newGroupName = 'NEW_GROUP'
    const newItemId = 'NEW_ITEM'
    const newItemText = 'New Text'

    const getTestItemsBase = () => {
      const items = getBaseItems()
      items['SECOND']

      items[newGroupName] = [
        {
          id: newItemId,
          item: newItemText
        }
      ]
      return items
    }

    let testItems = getTestItemsBase()

    let testSetItemGroupsSpy
    let testSetItemGroups = jest.fn<Dispatch<SetStateAction<ItemGroups>>>(
      setItemGroupsFunction => {
        if (typeof setItemGroupsFunction === 'function') {
          testSetItemGroupsSpy = jest.fn(setItemGroupsFunction)
          testItems = testSetItemGroupsSpy(testItems)
        }
      }
    )

    let testSetLastOverContainerIdSpy
    let lastOverContainerId: UniqueIdentifier | null = FIRST_CONTAINER_ID
    let testSetLastOverContainerId = jest.fn<
      Dispatch<SetStateAction<UniqueIdentifier | null>>
    >(setLastOverContainerIdFunction => {
      if (typeof setLastOverContainerIdFunction === 'function') {
        testSetLastOverContainerIdSpy = jest.fn(setLastOverContainerIdFunction)

        lastOverContainerId = testSetLastOverContainerIdSpy(lastOverContainerId)
      }
    })

    const resetHandleDragOver = () => {
      return createHandleDragOver({
        setItemGroups: testSetItemGroups,
        lastOverContainerId,
        setLastOverContainerId: testSetLastOverContainerId,
        dragStartContainerId: FIRST_CONTAINER_ID,
        getItemGroupData,
        active: {
          ...basicActive,
          data: {
            current: {
              dndCopy: true
            }
          }
        },
        getUniqueId: () => `${id}${++idCounter}`
      })
    }

    // perform first drag to second container
    let handleDragOver = resetHandleDragOver()

    handleDragOver({
      active: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID,
              index: 0
            }
          }
        }
      },
      over: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 1
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    const expectedItems = getTestItemsBase()
    const baseItem = {
      ...expectedItems[FIRST_CONTAINER_ID][0]
    }
    expectedItems[SECOND_CONTAINER_ID].push({
      ...baseItem
    })

    expectedItems[FIRST_CONTAINER_ID][0] = {
      ...expectedItems[FIRST_CONTAINER_ID][0],
      copiedFromId: expectedItems[FIRST_CONTAINER_ID][0].id,
      copiedToContainer: SECOND_CONTAINER_ID,
      id: `${id}${idCounter}`
    }

    expect(testSetItemGroupsSpy).lastReturnedWith(expectedItems)

    handleDragOver = resetHandleDragOver()

    // perform second drag over with updated info

    handleDragOver({
      active: {
        id: SECOND_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: SECOND_CONTAINER_ID,
              index: 1
            }
          }
        }
      },
      over: {
        id: newGroupName,
        data: {
          current: {
            sortable: {
              containerId: newGroupName,
              index: 1
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    expectedItems[newGroupName].push({
      ...baseItem
    })

    expectedItems[FIRST_CONTAINER_ID][0].copiedToContainer = newGroupName
    expectedItems[SECOND_CONTAINER_ID].splice(1)

    expect(testSetItemGroupsSpy).lastReturnedWith(expectedItems)

    handleDragOver = resetHandleDragOver()

    // perform return to first container

    handleDragOver({
      over: {
        id: FIRST_CONTAINER_ID,
        data: {
          current: {
            sortable: {
              containerId: FIRST_CONTAINER_ID,
              index: 0
            }
          }
        }
      },
      active: {
        id: newGroupName,
        data: {
          current: {
            sortable: {
              containerId: newGroupName,
              index: 1
            }
          }
        }
      }
    } as unknown as DragOverEvent)

    expectedItems[newGroupName].push({
      ...baseItem
    })

    expectedItems[FIRST_CONTAINER_ID][0] = { ...baseItem }
    expectedItems[newGroupName].splice(1)

    expect(testSetItemGroupsSpy).lastReturnedWith(expectedItems)
  })
})
