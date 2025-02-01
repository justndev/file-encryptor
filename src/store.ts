import { configureStore } from '@reduxjs/toolkit';
import appSlice from './appSlice';

const store = configureStore({
  reducer: {
    counter: appSlice, // Add reducers here
  },
});

export default store;
