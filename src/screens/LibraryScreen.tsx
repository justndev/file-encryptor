import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { Button, Portal, Modal } from 'react-native-paper';
import CustomIcon from '../components/CustomIcon';
import { icons } from '../utils/icons';
import FilesContainer from '../components/FilesContainer';
import FileCard from '../components/FileCard';
import FirebaseService from '../services/FirebaseService';
import { useDispatch, useSelector } from 'react-redux';
import { removeSelectedFileToDownload, setSelectedFileToDownload } from '../redux/appSlice';
import FileService from '../services/FileService';

const LibraryScreen = () => {
  const [isEditMode, setEditMode] = useState(false);
  const userId = useSelector((state) => state.user.userId)
  const selectedFileToDownload = useSelector((state) => state.app.selectedFileToDownload)
  const dispatch = useDispatch()
  const [userFiles, setUserFiles] = useState<any>([])

  useEffect(() => {
    if (selectedFileToDownload) {
      console.log("Selected file updated:", selectedFileToDownload);
    }
  }, [selectedFileToDownload]);

  useEffect(()=> {
    console.log('use effect start')
    async function fetchFiles() {
      try {
        console.log(userId)
        userId && setUserFiles(await FirebaseService.getFileLinksFromFirestore(userId))
      } catch (error) {
        const errorMsg = `Error fethcing file urls: ${error.message}`
        console.log(errorMsg)
        Alert.alert(errorMsg)
      }
    }
    fetchFiles()
  }, []);

  function removeSelectedFile() {
    dispatch(removeSelectedFileToDownload())
  }

  const checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
};

  function handleDownload(){
    checkAndroidPermission()
    FileService.downloadAndSaveFile(selectedFileToDownload.fileUrl, selectedFileToDownload.fileName)
  }

  function handleDelete() {

  }

  function displayTopButtons() {
    if (isEditMode)
      return (
        <View style={styles.header}>
          <Button mode="contained" onPress={() => console.log('Pressed')}>
            Cancel
          </Button>
          <Button mode="contained" onPress={() => console.log('Pressed')}>
            Delete
          </Button>
        </View>
      );
    else
      return (
        <View style={styles.header}>
          <Button mode="contained" onPress={() => console.log('Pressed')}>
            Edit
          </Button>
          <Button mode="contained" onPress={() => console.log('Pressed')}>
            Edit
          </Button>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      {displayTopButtons()}
      <FilesContainer files={userFiles} />
      <Portal>
        <Modal
          visible={!!selectedFileToDownload}
          onDismiss={() => removeSelectedFile()}
          contentContainerStyle={containerStyle}
        >
            <View style={styles.modalExitContainer}>
              <CustomIcon source={icons.cross} size={25} onPress={() => removeSelectedFile()} />
            </View>

            {selectedFileToDownload && <FileCard fileUrl={selectedFileToDownload.fileUrl} fileName={selectedFileToDownload.fileName} fileSize={selectedFileToDownload.fileSize} type={undefined} />}
            <View style={styles.modalButtonsContainer}>
              <Button mode="contained" onPress={handleDownload}>
                Download
              </Button>
              <Button mode="contained" onPress={() => console.log('Pressed')}>
                Delete
              </Button>
            </View>
        </Modal>
      </Portal>
  
    </View>
  );
};

const containerStyle = {
  backgroundColor: 'white',
  padding: 20,
  alignSelf: 'center',
  width: '80%',
  borderRadius: 10,
  alignItems: 'center',
  flexDirection: 'column',
  gap: 5,
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
  modal: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 5,
  },
  modalExitContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButtonsContainer: {
    flexDirection: 'column',
    gap: 5,
  },
});

export default LibraryScreen;
