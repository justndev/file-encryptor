import { createSlice } from '@reduxjs/toolkit';

interface File {
  fileName: string;
  fileSize: string;
  fileUrl: string;
  userId: string;
  fileId: string;
  iv: any;
  salt: any;
};

const initialState: {
  selectedFileToDownload: File | null;
  selectedFileToUpload: File | null;
  userFiles: File[];
} = {
  selectedFileToDownload: null,
    selectedFileToUpload: null,
    userFiles: []
};

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
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
    setUserFiles: (state, action) => {
      state.userFiles = action.payload.userFiles
    }
  },
});

export const { setSelectedFileToDownload, setSelectedFileToUpload, removeSelectedFileToDownload, removeSelectedFileToUpload, setUserFiles } = appSlice.actions;
export default appSlice.reducer;
