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
}

export default copyBetweenMultipleSortableContainersMouse
