import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { DocumentPickerResponse } from 'react-native-document-picker';
import CustomModal from '../components/CustomModal';
import FileCard from '../components/FileCard';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fileController } from '../controllers/FileController';


const EncryptionScreen = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.userSlice.user);

  const handleFilePick = async () => {
    try {
      const result = await fileController.pickDocument();
      if (result) {
        setSelectedFile(result);
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const handleEncryptAndUpload = async () => {
    if (!selectedFile || !user) return;
    
    setIsLoading(true);
    try {
      await fileController.uploadFile(
        user.uid,
        selectedFile.uri,
        selectedFile.name,
        selectedFile.size.toString()
      );
      setShowSnackbar(true);
      setSelectedFile(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        mode="contained" 
        onPress={handleFilePick}
        disabled={isLoading}
      >
        Select Document
      </Button>

      <CustomModal 
        visible={!!selectedFile} 
        onDismiss={() => setSelectedFile(null)}
      >
        {selectedFile && (
          <>
            <FileCard 
              link={undefined} 
              fileName={selectedFile.name} 
              size={selectedFile.size} 
              type={2} 
            />
            <View style={styles.modalButtonsContainer}>
              <Button 
                mode="contained" 
                onPress={handleEncryptAndUpload}
                loading={isLoading}
                disabled={isLoading}
              >
                Encrypt & Upload
              </Button>
            </View>
          </>
        )}
      </CustomModal>

      <Snackbar
        duration={3000}
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{ label: 'Dismiss', onPress: () => {} }}
      >
        File Uploaded Successfully!
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'column',
    gap: 5,
  },
});

export default EncryptionScreen;
