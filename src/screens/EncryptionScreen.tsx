import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomIcon from '../components/CustomIcon';
import FileCard from '../components/FileCard';
import { icons } from '../utils/icons';
import { ActivityIndicator, Button, MD2Colors, Modal, Portal, Snackbar } from 'react-native-paper';

const EncryptionScreen = () => {
  const [selectedFile, setSelectedFile] = useState()
  const [showModal, setShowModal] = useState(false)
  const [showActivity, setShowActivity] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => setShowSnackbar(true)}>
        Select File
      </Button>

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={containerStyle}
        >
            <View style={styles.modalExitContainer}>
              <CustomIcon source={icons.cross} size={25} onPress={() => setShowModal(false)} />
            </View>

            <FileCard link={undefined} fileName="text.txt" size="68KB" type={2} />
            <View style={styles.modalButtonsContainer}>
              {
                showActivity ?
                  <ActivityIndicator animating={true} size='medium' />
                  :
                  <Button mode="contained" onPress={() => console.log('Pressed')}>
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
