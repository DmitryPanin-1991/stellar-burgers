import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedProps = {
  children: ReactElement;
  onlyGuest?: boolean;
};

export const Protected: FC<ProtectedProps> = ({ children, onlyGuest }) => {
  const user = useSelector((state) => state.user.user);
  const isChecked = useSelector((state) => state.user.isChecked);
  const location = useLocation();

  if (!isChecked) {
    return <Preloader />;
  }

  if (!onlyGuest && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyGuest && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};
