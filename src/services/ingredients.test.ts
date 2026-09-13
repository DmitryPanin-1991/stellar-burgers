import { ingredientsReducer, getIngredients } from './ingredients';

describe('Ингредиенты', () => {
  test('возвращает начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('устанавливает состояние загрузки', () => {
    const state = ingredientsReducer(undefined, {
      type: getIngredients.pending.type
    });

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('сохраняет загруженные ингредиенты', () => {
    const ingredients = [
      {
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
      }
    ];

    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      {
        type: getIngredients.fulfilled.type,
        payload: ingredients
      }
    );

    expect(state).toEqual({
      ingredients,
      isLoading: false,
      error: null
    });
  });

  test('сохраняет ошибку загрузки', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      {
        type: getIngredients.rejected.type,
        error: {
          message: 'Ошибка загрузки'
        }
      }
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
