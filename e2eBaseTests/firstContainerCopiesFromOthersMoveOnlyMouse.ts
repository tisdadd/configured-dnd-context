import { expect, Page } from '@playwright/test'
import moveMouseRelativeToBoundingBox from './util/moveMouseRelativeToBoundingBox'

async function firstContainerCopiesFromOthersMoveOnlyMouse (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
) {
  await page.goto(url)

  const square1A = await page.getByRole('button', { name: baseName + ' 1-A' })
  const square2B = await page.getByRole('button', { name: baseName + ' 2-B' })
  const square3C = await page.getByRole('button', { name: baseName + ' 3-C' })

  const squareABoundingBox1 = await square1A.boundingBox()
  const squareBBoundingBox1 = await square2B.boundingBox()
  const squareCBoundingBox1 = await square3C.boundingBox()

  expect(squareABoundingBox1?.y).toBeLessThan(squareBBoundingBox1?.y || 0)
  expect(squareBBoundingBox1?.y).toBeLessThan(squareCBoundingBox1?.y || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareBBoundingBox1?.x || 0)
  expect(squareBBoundingBox1?.x).toBeLessThan(squareCBoundingBox1?.x || 0)

  // copy square 1A
  await square1A.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareBBoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * -1.5
  })
  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(201)

  // want to be able to move the copied square in same container
  // move square 1A - copied
  await square1A.nth(1).hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareBBoundingBox1, {
    x: 0,
    y: (squareABoundingBox1?.height || 0) * 1.5
  })
  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(201)
  await page.waitForTimeout(1001)

  // move square 2b
  await square2B.hover()
  await page.mouse.down()
  await page.waitForTimeout(201)
  await moveMouseRelativeToBoundingBox(page, squareCBoundingBox1, {
    x: 0,
    y: (squareBBoundingBox1?.height || 0) * 2
  })
  await page.waitForTimeout(201)
  await page.mouse.up()
  await page.waitForTimeout(1001)

  const squareABoundingBox2 = await square1A.nth(1).boundingBox()
  const squareBBoundingBox2 = await square2B.boundingBox()
  const squareCBoundingBox2 = await square3C.boundingBox()

  // should be below original and to the right
  expect(squareABoundingBox1?.y).toBeLessThan(squareABoundingBox2?.y || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareABoundingBox2?.x || 0)

  // new order should be a = c and b > both
  expect(squareBBoundingBox2?.y).toBeGreaterThan(squareCBoundingBox2?.y || 0)
  expect(squareCBoundingBox2?.y).toBe(squareABoundingBox2?.y || 0)

  // b.x should be c.x
  expect(squareCBoundingBox2?.x).toBe(squareBBoundingBox2?.x || 0)
  // squareA left of the other two
  expect(squareCBoundingBox2?.x).toBe(squareBBoundingBox2?.x || 0)
  expect(squareABoundingBox1?.x).toBeLessThan(squareBBoundingBox2?.x || 0)

  // square b is now to the lower right
  expect(squareBBoundingBox1?.x).toBeLessThan(squareBBoundingBox2?.x || 0)
  expect(squareBBoundingBox1?.x).toBeLessThan(squareBBoundingBox2?.x || 0)

  // and original square should be where it was
  expect(squareABoundingBox1).toStrictEqual(await square1A.nth(0).boundingBox())

  // and no new extra square for B
  expect((await square2B.all()).length).toBe(1)
}

export default firstContainerCopiesFromOthersMoveOnlyMouse
