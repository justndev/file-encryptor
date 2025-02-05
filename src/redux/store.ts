import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import appSlice from './appSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice
  },
});

export default store;
