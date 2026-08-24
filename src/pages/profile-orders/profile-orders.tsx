import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getProfileOrders } from '../../services/profile-orders';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.profileOrders.orders);
  const isLoading = useSelector((state) => state.profileOrders.isLoading);
  const error = useSelector((state) => state.profileOrders.error);

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
