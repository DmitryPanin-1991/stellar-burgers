import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedProps = {
  children: ReactElement;
  onlyGuest?: boolean;
};

export const Protected: FC<ProtectedProps> = ({ children, onlyGuest }) => {
  const user = useSelector((state) => state.user.user);
  const isChecked = useSelector((state) => state.user.isChecked);

  if (!isChecked) {
    return null;
  }

  if (!onlyGuest && !user) {
    return <Navigate to='/login' replace />;
  }

  if (onlyGuest && user) {
    return <Navigate to='/' replace />;
  }

  return children;
};
