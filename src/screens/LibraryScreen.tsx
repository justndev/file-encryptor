import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';

import FirebaseService from '../services/firebaseService';
import { useDispatch, useSelector } from 'react-redux';
import { removeSelectedFileToDownload, setUserFiles } from '../redux/appSlice';
import { RootState } from '../redux/store';

import FilesContainer from '../components/FilesContainer';
import FileCard from '../components/FileCard';
import CustomModal from '../components/CustomModal';
import storageService from '../services/storageService';
import firebaseService from '../services/firebaseService';


const LibraryScreen = () => {
  const { isEditMode, userFiles, selectedFileToDownload } = useSelector((state: RootState) => state.app);

  const { user } = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchFiles() {
      try {
        const result = await FirebaseService.getFileLinksFromFirestore(user.uid)
        console.log(result)
       result && dispatch(setUserFiles({userFiles: result}))
      } catch (error) {
        const errorMsg = `Error fethcing file urls: ${(error as Error).message}`

        console.log(errorMsg)
        Alert.alert(errorMsg)
      }
    }

    fetchFiles()
  }, []);

  function removeSelectedFile() {
    dispatch(removeSelectedFileToDownload())
  };


  async function handleDownload() {
    try {
      if (!selectedFileToDownload) return

      const filePath = await storageService.downloadFile(selectedFileToDownload.fileUrl, selectedFileToDownload.fileName)
      const msg = `File succefully downloaded: ${filePath}`
      
      console.log(msg)
      Alert.alert(msg)

    } catch (error) {
      const errorMsg = `Error downloading file: ${(error as Error).message}`

      console.log(errorMsg)
      Alert.alert(errorMsg)
    };
  };

  async function handleDelete() {
    if (!selectedFileToDownload) return
    try {
      await firebaseService.deleteFileAndDocument(selectedFileToDownload?.fileId);
      Alert.alert('File deleted');
    } catch (error) {
      const errorMsg = `Error deleting file: ${(error as Error).message}`

      console.log(errorMsg)
      Alert.alert(errorMsg)
    };
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        {isEditMode ? (
          <>
            <Button mode="contained" onPress={() => console.log('Pressed')}>
              Cancel
            </Button>
            <Button mode="contained" onPress={() => console.log('Pressed')}>
              Delete
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={() => console.log('Not implemented')}>
            Edit
          </Button>
        )}
      </View>
    );
  };  

  return (
    <View style={styles.container}>
      <Header/>
      <FilesContainer userFiles={userFiles} />

      <CustomModal visible={!!selectedFileToDownload} onDismiss={removeSelectedFile}>
        {selectedFileToDownload && <FileCard fileUrl={selectedFileToDownload.fileUrl} fileName={selectedFileToDownload.fileName} fileSize={selectedFileToDownload.fileSize}/>}

        <View style={styles.modalButtonsContainer}>
          <Button mode="contained" onPress={handleDownload}>
            Download
          </Button>
          <Button mode="contained" onPress={handleDelete}>
            Delete
          </Button>
        </View>
      </CustomModal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-around',
  },
  modalButtonsContainer: {
    flexDirection: 'column',
    gap: 5,
  },
});

export default LibraryScreen;
