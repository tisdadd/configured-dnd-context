import { expect, Page } from '@playwright/test'

async function basicDragNoDropKeyboard (page: Page, url: string) {
  await page.goto(url)

  const square = await page.getByRole('button', { name: 'Drag Me' })
  const position1 = await square.boundingBox()

  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')

  await page.waitForTimeout(201)

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowDown')

  await page.waitForTimeout(201)

  const position2 = await square.boundingBox()

  expect(position2?.x).toBeGreaterThan(position1?.x || 0)
  expect(position2?.y).toBeGreaterThan(position1?.y || 0)

  await page.keyboard.press(' ')

  const position3 = await square.boundingBox()
  expect(position3?.x).toBe(position1?.x)
  expect(position3?.y).toBe(position1?.y)
}

export default basicDragNoDropKeyboard
