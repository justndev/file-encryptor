import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CustomIcon from '../components/CustomIcon';
import FileCard from '../components/FileCard';
import { icons } from '../utils/icons';
import { ActivityIndicator, Button, MD2Colors, Modal, Portal, Snackbar } from 'react-native-paper';
import { requestDocumentWithPermission, requestGalleryWithPermission, requestCameraWithPermission } from '../services/PickerHelper';
import FirebaseService from '../services/FirebaseService';
import EncryptionService from '../services/EncryptionService';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth'
import { logout } from '../redux/userSlice';
import { useNavigation } from '@react-navigation/native';

const EncryptionScreen = () => {
  const [selectedFile, setSelectedFile] = useState<any>()
  const [showModal, setShowModal] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch()
  const navigation = useNavigation(); // To navigate after logout

  const handleLogout = async () => {
    try {
      await auth().signOut(); // ✅ Sign out from Firebase
      dispatch(logout()); // ✅ Clear user data from Redux
      Alert.alert('Success', 'You have been logged out.');
      navigation.navigate('Welcome'); // ✅ Navigate to Welcome/Login screen
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // https://dev.to/ajmal_hasan/react-native-fileimage-picker-1o2j
  const onPressItem = async (index) => {
    setTimeout(async () => {
      if (index === 0) {
        const response = await requestDocumentWithPermission();
      Alert.alert(JSON.stringify(response));
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
  };

  async function handleEncryptAndUpload() {
    FirebaseService.uploadFile(selectedFile, selectedFile.name, selectedFile.size, EncryptionService.generateKey(), userId)
  }; 

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => setShowSnackbar(true)}>
        Select File
      </Button>
      <View>
      <TouchableOpacity onPress={() => onPressItem(0)}>
        <Text>Open Document</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPressItem(1)} >
        <Text>Open Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPressItem(2)}>
        <Text>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>auth().signOut()}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>

      <Portal>
        <Modal
          visible={!!selectedFile}
          onDismiss={() => setShowModal(false)}
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
            // Do something
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
