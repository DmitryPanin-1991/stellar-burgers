import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../utils/cookie';
import { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isChecked: boolean;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isChecked: false
};

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: Parameters<typeof loginUserApi>[0]) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: Parameters<typeof registerUserApi>[0]) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', logoutApi);

export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isChecked = true;
        state.error =
          action.error.message || 'Не удалось получить данные пользователя';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось войти в аккаунт';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось создать аккаунт';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        state.isLoading = false;
        state.user = null;
        state.isChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось выйти из аккаунта';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось обновить данные профиля';
      });
  }
});

export const userReducer = userSlice.reducer;
