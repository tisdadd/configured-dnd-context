import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function sortableContainerWithAddAndRemoveDragAndDropsMouse (
  page: Page,
  url: string
) {
  await page.goto(url)

  let squareA = await page.getByRole('button', { name: 'Drag Me 1-A' })
  const square1 = await page.getByRole('button', {
    name: 'Drag Me 1',
    exact: true
  })
  const square2 = await page.getByRole('button', {
    name: 'Drag Me 2',
    exact: true
  })

  const squareMove = await page.getByRole('button', { name: 'Drag Me Move' })
  const dropZone = await page.getByText(/Drop To Delete/i)

  const squareABoundingBox1 = await squareA.boundingBox()
  const square1BoundingBox1 = await square1.boundingBox()
  const squareMoveBoundingBox1 = await squareMove.boundingBox()

  // no square 2 yet
  expect((await square2.all()).length).toBe(0)
  // expect x to be less for move and square 1 than the sortable containers squareA
  expect(square1BoundingBox1?.x).toBeLessThan(squareABoundingBox1?.x || 0)
  expect(squareMoveBoundingBox1?.x).toBeLessThan(squareABoundingBox1?.x || 0)

  // copy square1 to sortable container
  await square1.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  moveMouseRelativeToBoundingBox(page, squareABoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * 2
  })

  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  const square1BoundingBox2 = await square1.boundingBox()

  // expect to have moved down and to the same x as squareA
  expect(square1BoundingBox2?.x).toBe(squareABoundingBox1?.x || 0)
  expect(square1BoundingBox2?.y).toBeGreaterThan(square1BoundingBox1?.y || 0)

  // square 2 should now exist with the copy effect
  expect((await square2.all()).length).toBe(1)

  // move squareMove to sortable container
  await squareMove.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  moveMouseRelativeToBoundingBox(page, squareABoundingBox1, {
    x: 0,
    y: (square1BoundingBox1?.height || 0) * 2
  })

  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  // bounding box for the sortable containers should have shifted as square move no longer has its own spot in flex
  const squareABoundingBox2 = await squareA.boundingBox()
  expect(squareABoundingBox2?.x).toBeLessThan(squareABoundingBox1?.x || 0)

  // but square move should be there now
  const squareMoveBoundingBox2 = await squareMove.boundingBox()
  expect(squareMoveBoundingBox2?.x).toBe(squareABoundingBox2?.x || 0)

  // finally, delete square move
  // expect to have moved down and to the same x as squareA
  await squareMove.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  moveMouseRelativeToBoundingBox(page, await dropZone.boundingBox(), {
    x: 0,
    y: 0
  })

  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  expect((await squareMove.all()).length).toBe(0)
}

export default sortableContainerWithAddAndRemoveDragAndDropsMouse
