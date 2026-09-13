import {
  constructorReducer,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructor';

import { createOrder } from './new-order';

describe('Конструктор бургера', () => {
  test('возвращает начальное состояние', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('добавляет булку в конструктор', () => {
    const bun = {
      _id: 'bun-test',
      name: 'Тестовая булка',
      type: 'bun',
      calories: 100,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      price: 100,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const state = constructorReducer(undefined, setBun(bun));

    expect(state).toEqual({
      bun,
      ingredients: []
    });
  });

  test('добавляет ингредиент в конструктор', () => {
    const ingredient = {
      _id: 'main-test',
      name: 'Тестовая начинка',
      type: 'main',
      calories: 250,
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      price: 150,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large',
      id: 'ingredient-1'
    };

    const state = constructorReducer(undefined, addIngredient(ingredient));

    expect(state).toEqual({
      bun: null,
      ingredients: [ingredient]
    });
  });

  test('удаляет ингредиент из конструктора', () => {
    const ingredient = {
      _id: 'main-test',
      name: 'Тестовая начинка',
      type: 'main',
      calories: 250,
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      price: 150,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large',
      id: 'ingredient-1'
    };

    const state = constructorReducer(
      {
        bun: null,
        ingredients: [ingredient]
      },
      removeIngredient('ingredient-1')
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('меняет порядок ингредиентов', () => {
    const firstIngredient = {
      _id: 'main-1',
      name: 'Первая начинка',
      type: 'main',
      calories: 250,
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      price: 150,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large',
      id: 'ingredient-1'
    };

    const secondIngredient = {
      _id: 'main-2',
      name: 'Вторая начинка',
      type: 'main',
      calories: 300,
      proteins: 25,
      fat: 10,
      carbohydrates: 10,
      price: 200,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large',
      id: 'ingredient-2'
    };

    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      },
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [secondIngredient, firstIngredient]
    });
  });

  test('очищает конструктор', () => {
    const bun = {
      _id: 'bun-test',
      name: 'Тестовая булка',
      type: 'bun',
      calories: 100,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      price: 100,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const ingredient = {
      _id: 'main-test',
      name: 'Тестовая начинка',
      type: 'main',
      calories: 250,
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      price: 150,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large',
      id: 'ingredient-1'
    };

    const state = constructorReducer(
      {
        bun,
        ingredients: [ingredient]
      },
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('очищает конструктор после оформления заказа', () => {
    const bun = {
      _id: 'bun-test',
      name: 'Тестовая булка',
      type: 'bun',
      calories: 100,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      price: 100,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large'
    };

    const ingredient = {
      _id: 'main-test',
      name: 'Тестовая начинка',
      type: 'main',
      calories: 250,
      proteins: 20,
      fat: 15,
      carbohydrates: 5,
      price: 150,
      image: 'image',
      image_mobile: 'image-mobile',
      image_large: 'image-large',
      id: 'ingredient-1'
    };

    const state = constructorReducer(
      {
        bun,
        ingredients: [ingredient]
      },
      {
        type: createOrder.fulfilled.type
      }
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
