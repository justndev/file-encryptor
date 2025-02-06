import { createSlice } from '@reduxjs/toolkit';

interface User {
  uid: string;
  email: string;
};

const initialState: { user: User | null } = {
  user: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
