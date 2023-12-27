import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function sortableContainerWithAddAndRemoveDragAndDropsMouse (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
) {
  await page.goto(url)

  const squareA = await page.getByRole('button', { name: 'Drag Me 1-A' })
  const square1 = await page.getByRole('button', {
    name: 'Drag Me 1',
    exact: true
  })
  const square2 = await page.getByRole('button', {
    name: 'Drag Me 2',
    exact: true
  })

  const squareMove = await page.getByRole('button', { name: 'Drag Me Move' })

  const squareABoundingBox1 = await squareA.boundingBox()
  const square1BoundingBox1 = await square1.boundingBox()
  const squareMoveBoundingBox1 = await squareMove.boundingBox()

  // no square 2 yet
  expect((await square2.all()).length).toBe(0)
  // expect x to be less for move and square 1 than the sortable containers squareA
  expect(square1BoundingBox1?.x).toBeLessThan(squareABoundingBox1?.x || 0)
  expect(squareMoveBoundingBox1?.x).toBeLessThan(squareABoundingBox1?.x || 0)

  // copy square1 to sortable container
  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press(' ')

  await page.waitForTimeout(1001)

  // webkit was flakey doing with square1...
  const square1BoundingBox2 = await page
    .getByRole('button', {
      name: 'Drag Me 1',
      exact: true
    })
    .boundingBox()

  // expect to have moved down and to the same x as squareA
  expect(square1BoundingBox2?.x).toBe(squareABoundingBox1?.x || 0)
  expect(square1BoundingBox2?.y).toBeGreaterThan(square1BoundingBox1?.y || 0)

  // square 2 should now exist with the copy effect
  expect((await square2.all()).length).toBe(1)

  // move squareMove to sortable container
  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press(' ')

  await page.waitForTimeout(1001)

  // bounding box for the sortable containers should have shifted as square move no longer has its own spot in flex
  const squareABoundingBox2 = await squareA.boundingBox()
  expect(squareABoundingBox2?.x).toBeLessThan(squareABoundingBox1?.x || 0)

  // but square move should be there now
  const squareMoveBoundingBox2 = await squareMove.boundingBox()
  expect(squareMoveBoundingBox2?.x).toBe(squareABoundingBox2?.x || 0)

  // finally, delete square move
  await page.keyboard.press(' ')

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press(' ')

  await page.waitForTimeout(1001)

  expect((await squareMove.all()).length).toBe(0)
}

export default sortableContainerWithAddAndRemoveDragAndDropsMouse
