import { expect, Page } from '@playwright/test'

async function basicAbsoluteDragCoordinatesKeyboard (
  page: Page,
  url: string,
  baseName: string = 'Drag Me'
) {
  await page.goto(url)
  const square = await page.getByRole('button', { name: baseName + ' ' })
  const position1 = await square.boundingBox()
  await page.keyboard.press('Tab')
  await page.keyboard.press(' ')

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press(' ')

  const position2 = await square.boundingBox()
  expect(position2?.x).toBeGreaterThan(position1?.x || 0)
  expect(position2?.y).toBeGreaterThan(position1?.y || 0)
}

export default basicAbsoluteDragCoordinatesKeyboard
