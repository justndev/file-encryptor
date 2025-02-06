import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Button, Modal, Portal, Snackbar } from 'react-native-paper';

import { requestGalleryWithPermission, requestCameraWithPermission } from '../services/PickerHelper';
import { useSelector } from 'react-redux';
import storageService from '../services/storageService';
import firebaseService from '../services/firebaseService';
import { RootState } from '../redux/store';

import CustomIcon from '../components/CustomIcon';
import FileCard from '../components/FileCard';
import { icons } from '../utils/icons';


const EncryptionScreen = () => {
  const [selectedFile, setSelectedFile] = useState<any>()
  const [showActivity, setShowActivity] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const user = useSelector((state: RootState) => state.user.user)

  // https://dev.to/ajmal_hasan/react-native-fileimage-picker-1o2j
  const onPressItem = async (index: number) => {
    try {
      setTimeout(async () => {
        if (index === 0) {
          const file = await storageService.pickFile();
          file && setSelectedFile(file)
        Alert.alert(JSON.stringify(file));
        }
        if (index === 1) {
          const response = await requestGalleryWithPermission();
          response && setSelectedFile(response)
          Alert.alert(JSON.stringify(response));
        }
        if (index === 2) {
          const response = await requestCameraWithPermission();
          Alert.alert(JSON.stringify(response));
        }
      }, 1000);

    } catch (error) {
      const errMsh = `Error: + ${(error as Error).message}`
      console.log(errMsh)
      Alert.alert(errMsh)
    };
  };

  async function handleEncryptAndUpload() {
    try {
      const fileUrl = await storageService.uploadFile(selectedFile.uri, selectedFile.name);
      firebaseService.addFileUrlToFirestore(user.user.uid, fileUrl, selectedFile.name, selectedFile.size)
      setShowSnackbar(true)
    } catch (error) {

      const errMsh = `Error: + ${(error as Error).message}`
      console.log(errMsh)
      Alert.alert(errMsh)
    };
  }; 

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => onPressItem(0)}>
        Select File
      </Button>

      <Portal>
        <Modal
          visible={!!selectedFile}
          onDismiss={() => setSelectedFile(null)}
          contentContainerStyle={containerStyle}
        >
            <View style={styles.modalExitContainer}>
              <CustomIcon source={icons.cross} size={25} onPress={() => setSelectedFile(null)} />
            </View>

            {selectedFile && <FileCard link={undefined} fileName={selectedFile.name} size={selectedFile.size} type={2} />}
            <View style={styles.modalButtonsContainer}>
              {
                showActivity ?
                  <ActivityIndicator animating={true}/>
                  :
                  <Button mode="contained" onPress={() => handleEncryptAndUpload()}>
                    Encrypt & Upload
                  </Button>
              }
            </View>
        </Modal>
      </Portal>
      <Snackbar
        duration={3000}
        visible={showSnackbar}
        onDismiss={()=>setShowSnackbar(false)}
        action={{
          label: 'Dismiss',
          onPress: () => {
          },
        }}>
        Success!
      </Snackbar>
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
    justifyContent: 'center',
    alignItems: 'center',
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

export default EncryptionScreen;
