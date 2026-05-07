import { expect, test } from '@playwright/test'

test('runs the local private matching demo', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })
  await page.route('https://api.github.com/**', async (route) => {
    const url = route.request().url()
    if (url.endsWith('/commits/main')) {
      await route.fulfill({
        json: { sha: '7557f95e00000000000000000000000000000000' },
      })
      return
    }
    await route.fulfill({ json: { stargazers_count: 7 } })
  })

  await page.goto('/match-proof/')
  await expect(page.getByRole('heading', { name: /Find shared context/i })).toBeVisible()
  await page.getByRole('button', { name: /Run private demo/i }).click()

  await expect(page.getByText('University of Bucharest')).toBeVisible({
    timeout: 30_000,
  })
  await expect(page.getByText('zero knowledge systems')).toBeVisible()
  expect(consoleErrors).toEqual([])
})
