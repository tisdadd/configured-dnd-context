import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function dragOnlyToContainerOneRightMouse (page: Page, url: string) {
  await page.goto(url)

  const square1A = await page.getByRole('button', { name: 'Drag Me 1-A' })
  const square2B = await page.getByRole('button', { name: 'Drag Me 2-B' })
  const square3C = await page.getByRole('button', { name: 'Drag Me 3-C' })

  const squareABoundingBox1 = await square1A.boundingBox()
  const squareBBoundingBox1 = await square2B.boundingBox()
  const squareCBoundingBox1 = await square3C.boundingBox()

  expect(squareABoundingBox1?.y).toBeLessThan(squareBBoundingBox1?.y || 0)
  expect(squareBBoundingBox1?.y).toBeLessThan(squareCBoundingBox1?.y || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareBBoundingBox1?.x || 0)
  expect(squareBBoundingBox1?.x).toBeLessThan(squareCBoundingBox1?.x || 0)

  // move square 1A
  await square1A.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareBBoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * 1.5
  })
  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(201)

  // try to move square 3c
  await square3C.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareBBoundingBox1, {
    x: 0,
    y: (squareCBoundingBox1?.height || 0) * 2
  })
  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  const squareABoundingBox2 = await square1A.boundingBox()
  const squareBBoundingBox2 = await square2B.boundingBox()
  const squareCBoundingBox2 = await square3C.boundingBox()

  // should be below original and to the right
  expect(squareABoundingBox1?.y).toBeLessThan(squareABoundingBox2?.y || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareABoundingBox2?.x || 0)

  // new order should be b c a
  expect(squareBBoundingBox2?.y).toBeLessThan(squareCBoundingBox2?.y || 0)
  expect(squareCBoundingBox2?.y).toBeLessThan(squareABoundingBox2?.y || 0)

  // squareA lines up with square b horizontally
  expect(squareABoundingBox1?.x).toBeLessThan(squareBBoundingBox2?.x || 0)

  // and original square C should be where it was
  expect(squareCBoundingBox1).toStrictEqual(squareCBoundingBox2)
}

export default dragOnlyToContainerOneRightMouse
