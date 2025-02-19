import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { removeSelectedFileToDownload, setUserFiles } from '../redux/appSlice';
import { RootState } from '../redux/store';
import FilesContainer from '../components/FilesContainer';
import FileCard from '../components/FileCard';
import CustomModal from '../components/CustomModal';
import { useFocusEffect } from '@react-navigation/native';
import { fileController } from '../controllers/FileController';


const LibraryScreen = () => {
  const { userFiles, selectedFileToDownload } = useSelector(
    (state: RootState) => state.appSlice
  );
  const user = useSelector((state: RootState) => state.userSlice.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFiles = async () => {
        if (!user) return;
        
        try {
          const files = await fileController.getUserFiles(user.uid);
          dispatch(setUserFiles({ userFiles: files }));
        } catch (error) {
          Alert.alert('Error', (error as Error).message);
        }
      };

      fetchFiles();
    }, [user])
  );

  const handleDownload = async () => {
    if (!selectedFileToDownload) return;
    
    setIsLoading(true);
    try {
      const filePath = await fileController.downloadFile(
        selectedFileToDownload.fileId,
        selectedFileToDownload.fileUrl,
        selectedFileToDownload.fileName
      );
      Alert.alert('Success', `File downloaded to: ${filePath}`);
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFileToDownload?.fileId) return;
    
    setIsLoading(true);
    try {
      await fileController.deleteFile(selectedFileToDownload.fileId);
      dispatch(removeSelectedFileToDownload());
      Alert.alert('Success', 'File deleted successfully');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FilesContainer userFiles={userFiles} />
      <CustomModal 
        visible={!!selectedFileToDownload} 
        onDismiss={() => dispatch(removeSelectedFileToDownload())}
      >
        {selectedFileToDownload && (
          <>
            <FileCard 
              fileUrl={selectedFileToDownload.fileUrl}
              fileName={selectedFileToDownload.fileName}
              fileSize={selectedFileToDownload.fileSize}
            />
            <View style={styles.modalButtonsContainer}>
              <Button 
                mode="contained" 
                onPress={handleDownload}
                loading={isLoading}
                disabled={isLoading}
              >
                Download
              </Button>
              <Button 
                mode="contained" 
                onPress={handleDelete}
                loading={isLoading}
                disabled={isLoading}
              >
                Delete
              </Button>
            </View>
          </>
        )}
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'column',
    gap: 5,
  },
});

export default LibraryScreen;