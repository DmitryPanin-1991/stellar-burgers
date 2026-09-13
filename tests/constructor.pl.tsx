import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test('отображает ингредиенты на странице', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(page.getByText('Тестовая булка')).toBeVisible();
    await expect(page.getByText('Тестовая начинка')).toBeVisible();
    await expect(page.getByText('Тестовый соус')).toBeVisible();
  });

  test('добавляет ингредиенты в конструктор', async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
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
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.goto('/');
    await page.getByText('Тестовая булка').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    const modal = page
      .getByText('Детали ингредиента')
      .locator('..')
      .locator('..');

    await expect(modal.getByText('Тестовая булка')).toBeVisible();

    await modal.locator('button').click();
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('открывает модальное окно и закрывает по клику на оверлей', async ({
    page
  }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
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

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/auth/user',
      update: false
    });

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/orders',
      update: false
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
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
});
