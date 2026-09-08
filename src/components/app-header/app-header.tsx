import { useSelector } from '../../services/store';
import { FC } from 'react';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useSelector((state) => state.user.user);

  return <AppHeaderUI userName={user?.name || ''} />;
};
