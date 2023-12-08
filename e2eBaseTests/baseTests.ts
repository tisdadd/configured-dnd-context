import { test, expect } from '@playwright/test'
import basicDragNoDropMouse from '../e2eBaseTests/basicDragNoDropMouse'
import basicDragNoDropKeyboard from '../e2eBaseTests/basicDragNoDropKeyboard'
import basicAbsoluteDragCoordinatesMouse from '../e2eBaseTests/basicAbsoluteDragCoordinatesMouse'
import basicAbsoluteDragCoordinatesKeyboard from '../e2eBaseTests/basicAbsoluteDragCoordinatesKeyboard'
import basicSortableCollectionMouse from '../e2eBaseTests/basicSortableCollectionMouse'
import basicSortableCollectionKeyboard from '../e2eBaseTests/basicSortableCollectionKeyboard'
import copyBetweenMultipleSortableContainersMouse from '../e2eBaseTests/copyBetweenMultipleSortableContainersMouse'
import copyBetweenMultipleSortableContainersKeyboard from '../e2eBaseTests/copyBetweenMultipleSortableContainersKeyboard'
import moveBetweenMultipleSortableContainersMouse from '../e2eBaseTests/moveBetweenMultipleSortableContainersMouse'
import moveBetweenMultipleSortableContainersKeyboard from '../e2eBaseTests/moveBetweenMultipleSortableContainersKeyboard'
import firstContainerCopiesFromOthersMoveOnlyMouse from '../e2eBaseTests/firstContainerCopiesFromOthersMoveOnlyMouse'
import firstContainerCopiesFromOthersMoveOnlyKeyboard from '../e2eBaseTests/firstContainerCopiesFromOthersMoveOnlyKeyboard'
import multipleSortableContainersWithoutMovingBetweenThemMouse from '../e2eBaseTests/multipleSortableContainersWithoutMovingBetweenThemMouse'
import multipleSortableContainersWithoutMovingBetweenThemKeyboard from '../e2eBaseTests/multipleSortableContainersWithoutMovingBetweenThemKeyboard'
import dragOnlyToContainerOneRightMouse from '../e2eBaseTests/dragOnlyToContainerOneRightMouse'
import dragOnlyToContainerOneRightKeyboard from '../e2eBaseTests/dragOnlyToContainerOneRightKeyboard'
import sortableContainerWithDroppableContainerKeyboard from '../e2eBaseTests/sortableContainerWithDroppableContainerKeyboard'
import sortableContainerWithDroppableContainerMouse from '../e2eBaseTests/sortableContainerWithDroppableContainerMouse'
import sortableContainerWithAddAndRemoveDragAndDropsMouse from '../e2eBaseTests/sortableContainerWithAddAndRemoveDragAndDropsMouse'
import sortableContainerWithAddAndRemoveDragAndDropsKeyboard from '../e2eBaseTests/sortableContainerWithAddAndRemoveDragAndDropsKeyboard'

function baseTests (baseUrl: string) {
  test.describe('Basic Drag No Drop', () => {
    const url = `${baseUrl}--basic-drag-no-drop&viewMode=story`

    test('Should be able to drag via mouse, and on release return to start', async ({
      page
    }) => {
      await basicDragNoDropMouse(page, url)
    })

    test('Should be able to move via keyboard, and on release return to start', async ({
      page
    }) => {
      await basicDragNoDropKeyboard(page, url)
    })
  })

  test.describe('Basic Absolute Drag Coordinates', () => {
    const url = `${baseUrl}--basic-absolute-drag-coordinates&viewMode=story`
    test('Should be able to drag and drop into a position via mouse', async ({
      page
    }) => {
      await basicAbsoluteDragCoordinatesMouse(page, url)
    })

    test('Should be able to move to a new position via keyboard', async ({
      page
    }) => {
      await basicAbsoluteDragCoordinatesKeyboard(page, url)
    })
  })

  test.describe('Basic Sortable Collection', () => {
    const url = `${baseUrl}--basic-sortable-collection&viewMode=story`
    test('Should be able to drag and drop to change positions via mouse', async ({
      page
    }) => {
      await basicSortableCollectionMouse(page, url)
    })

    test('Should be able to move to a new position via keyboard', async ({
      page
    }) => {
      await basicSortableCollectionKeyboard(page, url)
    })
  })

  test.describe('Move Between Multiple Sortable Collections', () => {
    const url = `${baseUrl}--move-between-multiple-sortable-collections&viewMode=story`
    test('Should be able to drag and drop to change positions and collection via mouse', async ({
      page
    }) => {
      await moveBetweenMultipleSortableContainersMouse(page, url)
    })

    test('Should be able to move to a new position and collection via keyboard', async ({
      page
    }) => {
      await moveBetweenMultipleSortableContainersKeyboard(page, url)
    })
  })

  test.describe('Copy Between Multiple Sortable Collections', () => {
    const url = `${baseUrl}--copy-between-multiple-sortable-collections&viewMode=story`
    test('Should be able to drag and drop to copy to another collection via mouse', async ({
      page
    }) => {
      await copyBetweenMultipleSortableContainersMouse(page, url)
    })

    test('Should be able to copy to another collection via keyboard', async ({
      page
    }) => {
      await copyBetweenMultipleSortableContainersKeyboard(page, url)
    })
  })

  test.describe('First Container Copies From Others Move Only', () => {
    const url = `${baseUrl}--first-container-copies-from-others-move-only&viewMode=story`
    test('Should be able to drag and drop to copy or move to another collection via mouse', async ({
      page
    }) => {
      await firstContainerCopiesFromOthersMoveOnlyMouse(page, url)
    })

    test('Should be able to copy to another collection via keyboard', async ({
      page
    }) => {
      await firstContainerCopiesFromOthersMoveOnlyKeyboard(page, url)
    })
  })

  test.describe('Multiple Sortable Containers Without Moving Between Them', () => {
    const url = `${baseUrl}--multiple-sortable-containers-without-moving-between-them&viewMode=story`
    test('Should be able to drag and drop to copy or move to another collection via mouse', async ({
      page
    }) => {
      await multipleSortableContainersWithoutMovingBetweenThemMouse(page, url)
    })

    test('Should be able to copy to another collection via keyboard', async ({
      page
    }) => {
      await multipleSortableContainersWithoutMovingBetweenThemKeyboard(
        page,
        url
      )
    })
  })

  test.describe('Drag Only To Container One Right', () => {
    const url = `${baseUrl}--drag-only-to-container-one-right&viewMode=story`
    test('Should be able to drag and drop to copy or move to another collection via mouse', async ({
      page
    }) => {
      await dragOnlyToContainerOneRightMouse(page, url)
    })

    test('Should be able to copy to another collection via keyboard', async ({
      page
    }) => {
      await dragOnlyToContainerOneRightKeyboard(page, url)
    })
  })

  test.describe('Sortable Container With Droppable Container', () => {
    const url = `${baseUrl}--sortable-container-with-droppable-container&viewMode=story`
    test('Should be able to drop via mouse', async ({ page }) => {
      await sortableContainerWithDroppableContainerMouse(page, url)
    })

    test('Should be able to drop via keyboard', async ({ page }) => {
      await sortableContainerWithDroppableContainerKeyboard(page, url)
    })
  })

  test.describe('Sortable Container With Add And Remove Drag And Drops', () => {
    const url = `${baseUrl}--sortable-container-with-add-and-remove-drag-and-drops&viewMode=story`
    test('Should be able to add and remove via mouse', async ({ page }) => {
      await sortableContainerWithAddAndRemoveDragAndDropsMouse(page, url)
    })

    test('Should be able to drop via keyboard', async ({ page }) => {
      await sortableContainerWithAddAndRemoveDragAndDropsKeyboard(page, url)
    })
  })
}

export default baseTests
