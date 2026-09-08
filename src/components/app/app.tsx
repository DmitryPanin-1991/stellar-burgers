import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { Protected } from '../protected/protected';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/ingredients';
import { getUser } from '../../services/user';
import { useEffect } from 'react';
import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={
            <Protected onlyGuest>
              <Login />
            </Protected>
          }
        />
        <Route
          path='/register'
          element={
            <Protected onlyGuest>
              <Register />
            </Protected>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <Protected onlyGuest>
              <ForgotPassword />
            </Protected>
          }
        />
        <Route
          path='/reset-password'
          element={
            <Protected onlyGuest>
              <ResetPassword />
            </Protected>
          }
        />
        <Route
          path='/profile'
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <Protected>
              <ProfileOrders />
            </Protected>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Protected>
              <OrderInfo />
            </Protected>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Protected>
                <Modal title='' onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </Protected>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
