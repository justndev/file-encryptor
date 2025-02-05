import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    selectedFileToDownload: null,
    selectedFileToUpload: null
  },
  reducers: {
    setSelectedFileToDownload: (state, action) => {
      state.selectedFileToDownload = action.payload.file;
    },
    removeSelectedFileToDownload: (state) => {
      state.selectedFileToDownload = null;
    },
    setSelectedFileToUpload: (state, action) => {
        state.selectedFileToUpload = action.payload.file;
    },
    removeSelectedFileToUpload: (state) => {
      state.selectedFileToUpload = null;
    },
  },
});

export const { setSelectedFileToDownload, setSelectedFileToUpload, removeSelectedFileToDownload, removeSelectedFileToUpload } = appSlice.actions;
export default appSlice.reducer;
