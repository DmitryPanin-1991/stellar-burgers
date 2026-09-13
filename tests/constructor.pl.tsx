import { test, expect } from '@playwright/test';

test('отображает ингредиенты на странице', async ({ page }) => {
  await page.routeFromHAR('tests/ingredients.har', {
    notFound: 'fallback'
  });

  await page.goto('/');

  await expect(page.getByText('Тестовая булка')).toBeVisible();
  await expect(page.getByText('Тестовая начинка')).toBeVisible();
  await expect(page.getByText('Тестовый соус')).toBeVisible();
});

test('добавляет ингредиенты в конструктор', async ({ page }) => {
  await page.routeFromHAR('tests/ingredients.har', {
    notFound: 'fallback'
  });

  await page.goto('/');

  const bun = page.locator('li').filter({ hasText: 'Тестовая булка' });
  const main = page.locator('li').filter({ hasText: 'Тестовая начинка' });

  await bun.getByText('Добавить').click();
  await main.getByText('Добавить').click();
  await expect(page.getByText('Тестовая булка (верх)')).toBeVisible();
  await expect(page.getByText('Тестовая булка (низ)')).toBeVisible();

  await expect(
    page.locator('.constructor-element__text').filter({
      hasText: 'Тестовая начинка'
    })
  ).toBeVisible();
});

test('открывает модальное окно и закрывает по клику на крестик', async ({
  page
}) => {
  await page.routeFromHAR('tests/ingredients.har', {
    notFound: 'fallback'
  });

  await page.goto('/');
  await page.getByText('Тестовая булка').click();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  const modal = page
    .getByText('Детали ингредиента')
    .locator('..')
    .locator('..');

  await modal.locator('button').click();
  await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
});

test('открывает модальное окно и закрывает по клику на оверлей', async ({
  page
}) => {
  await page.routeFromHAR('tests/ingredients.har', {
    notFound: 'fallback'
  });

  await page.goto('/');
  await page.getByText('Тестовая булка').click();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();
  await page.mouse.click(10, 10);
  await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
});

test('оформляет заказ', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'stellar-access',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'stellar-refresh');
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          email: 'stellar@burger.ru',
          name: 'Космотестер'
        }
      })
    });
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Космический бургер',
        order: {
          _id: 'stellar-test',
          status: 'done',
          name: 'Космический бургер',
          owner: {
            name: 'Космотестер',
            email: 'stellar@burger.ru',
            createdAt: '2026-09-11T00:00:00.000Z',
            updatedAt: '2026-09-11T00:00:00.000Z'
          },
          createdAt: '2026-09-11T00:00:00.000Z',
          updatedAt: '2026-09-11T00:00:00.000Z',
          number: 1234,
          price: 42
        }
      })
    });
  });

  await page.routeFromHAR('tests/ingredients.har', {
    notFound: 'fallback'
  });

  await page.goto('/');

  const bun = page.locator('li').filter({ hasText: 'Тестовая булка' });
  const main = page.locator('li').filter({ hasText: 'Тестовая начинка' });

  await bun.getByText('Добавить').click();
  await main.getByText('Добавить').click();

  await page.getByText('Оформить заказ').click();

  await expect(page.getByText('1234')).toBeVisible();
  await expect(page.getByText('идентификатор заказа')).toBeVisible();

  await expect(page.getByText('Выберите булки')).toHaveCount(2);
  await expect(page.getByText('Выберите начинку')).toBeVisible();

  const modal = page
    .getByText('идентификатор заказа')
    .locator('..')
    .locator('..')
    .locator('..');

  await modal.locator('button').click();

  await expect(page.getByText('идентификатор заказа')).not.toBeVisible();
});
