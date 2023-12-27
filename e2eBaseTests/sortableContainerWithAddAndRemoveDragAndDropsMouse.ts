import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function sortableContainerWithAddAndRemoveDragAndDropsMouse (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
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

  const deleteSquare = async text => {
    // expect to have moved down and to the same x as squareA
    await page.getByText(text).hover()
    await page.mouse.down()
    await page.waitForTimeout(201)
    moveMouseRelativeToBoundingBox(page, await dropZone.boundingBox(), {
      x: 0,
      y: 0
    })

    await page.waitForTimeout(201)
    await page.mouse.up()
    await page.waitForTimeout(1001)

    expect((await page.getByText(text).all()).length).toBe(0)
  }

  // delete all squares that can be
  await deleteSquare('Drag Me 1-A')
  await deleteSquare('Drag Me 1-B')
  await deleteSquare('Drag Me 1-C')
  await deleteSquare('Drag Me 1-D')
  await deleteSquare('Drag Me 1')

  const noItemsBoundingBox = await page.getByText(/No Items/).boundingBox()

  // move squareMove to sortable container now that it should be empty
  await squareMove.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  moveMouseRelativeToBoundingBox(page, noItemsBoundingBox, {
    x: 0,
    y: 0
  })

  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  // there should only be one move square
  expect((await squareMove.all()).length).toBe(1)

  // delete squareMove
  await deleteSquare(/Drag Me Move/)
}

export default sortableContainerWithAddAndRemoveDragAndDropsMouse
