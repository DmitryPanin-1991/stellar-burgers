import { useDispatch, useSelector } from '../../services/store';
import { createOrder, clearOrder } from '../../services/new-order';
import { clearConstructor } from '../../services/constructor';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );

  const constructorItems = {
    bun,
    ingredients
  };

  const dispatch = useDispatch();
  const orderRequest = useSelector((state) => state.newOrder.isLoading);
  const orderModalData = useSelector((state) => state.newOrder.order);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
