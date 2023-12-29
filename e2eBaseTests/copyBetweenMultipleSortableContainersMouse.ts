import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function copyBetweenMultipleSortableContainersMouse (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
) {
  await page.goto(url)

  const square1A = await page.getByRole('button', { name: baseName + ' 1-A' })
  const square2B = await page.getByRole('button', { name: baseName + ' 2-B' })
  const square2C = await page.getByRole('button', { name: baseName + ' 2-C' })

  const squareABoundingBox1 = await square1A.boundingBox()
  const squareBBoundingBox1 = await square2B.boundingBox()
  const squareCBoundingBox1 = await square2C.boundingBox()

  expect(squareABoundingBox1?.y).toBeLessThan(squareBBoundingBox1?.y || 0)
  expect(squareBBoundingBox1?.y).toBeLessThan(squareCBoundingBox1?.y || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareBBoundingBox1?.x || 0)

  // move to middle location and back again - shouldn't throw errors that screw up the rest of the report
  await square1A.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareCBoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * 1.5
  })
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareABoundingBox1, {
    x: 0,
    y: 0
  })
  await page.waitForTimeout(201)
  await page.mouse.up()

  await page.waitForTimeout(1001)

  // move to middle location
  await square1A.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareCBoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * 1.5
  })
  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  const squareABoundingBox2 = await square1A.nth(1).boundingBox()
  const squareBBoundingBox2 = await square2B.boundingBox()
  const squareCBoundingBox2 = await square2C.boundingBox()

  // should be below original
  expect(squareABoundingBox1?.y).toBeLessThan(squareABoundingBox2?.y || 0)
  // new order should be b c a
  expect(squareBBoundingBox2?.y).toBeLessThan(squareCBoundingBox2?.y || 0)
  expect(squareCBoundingBox2?.y).toBeLessThan(squareABoundingBox2?.y || 0)
  // and the x should be same as the other two

  expect(squareABoundingBox2?.x).toBe(squareBBoundingBox2?.x || 0)

  // and original square should be where it was
  expect(squareABoundingBox1).toStrictEqual(await square1A.nth(0).boundingBox())

  // also, should be able to drag over two columns and drop on the second

  const square1D = await page.getByRole('button', { name: baseName + ' 1-D' })
  const square3C = await page.getByRole('button', { name: baseName + ' 3-C' })

  await square1D.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareCBoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * 1.5
  })
  await page.waitForTimeout(201)

  const square3CBoundingBox = await square3C.boundingBox()

  await moveMouseRelativeToBoundingBox(page, square3CBoundingBox, {
    x: 0,
    y: 0
  })

  await page.mouse.up()
  await page.waitForTimeout(1001)

  const square1DCopiedBoundingBox = await square1D.nth(1).boundingBox()
  // should be in the same column
  expect(square1DCopiedBoundingBox?.x).toBe(square3CBoundingBox?.x)
}

export default copyBetweenMultipleSortableContainersMouse
