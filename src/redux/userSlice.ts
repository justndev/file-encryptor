import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.userId = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
