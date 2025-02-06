import { createSlice } from '@reduxjs/toolkit';

interface File {
  fileName: string;
  fileSize: string;
  fileUrl: string;
  userId: string;
  fileId: string;
};

const initialState: {
  selectedFileToDownload: File | null;
  selectedFileToUpload: File | null;
  isEditMode: boolean;
  userFiles: File[];
} = {
  selectedFileToDownload: null,
    selectedFileToUpload: null,
    isEditMode: false,
    userFiles: []
};

const appSlice = createSlice({
  name: 'app',
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
    setEditMode: (state, action) => {
      state.isEditMode = action.payload.state
    },
    setUserFiles: (state, action) => {
      state.userFiles = action.payload.userFiles
    }
  },
});

export const { setSelectedFileToDownload, setSelectedFileToUpload, removeSelectedFileToDownload, removeSelectedFileToUpload, setEditMode, setUserFiles } = appSlice.actions;
export default appSlice.reducer;
