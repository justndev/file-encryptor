import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import appSlice from './appSlice';

const store = configureStore({
  reducer: {
    userSlice: userSlice,
    appSlice: appSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
