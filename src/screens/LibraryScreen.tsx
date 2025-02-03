import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Portal, Modal } from 'react-native-paper';
import CustomIcon from '../components/CustomIcon';
import { icons } from '../utils/icons';
import FilesContainer from '../components/FilesContainer';
import FileCard from '../components/FileCard';

const LibraryScreen = () => {
  const [isEditMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      <Button style={{ marginTop: 30 }} onPress={() => setShowModal(true)}>
        Show
      </Button>
      <FilesContainer files={[]} />
      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={containerStyle}
        >
            <View style={styles.modalExitContainer}>
              <CustomIcon source={icons.cross} size={25} onPress={() => setShowModal(false)} />
            </View>

            <FileCard link={undefined} fileName="text.txt" size="68KB" />
            <View style={styles.modalButtonsContainer}>
              <Button mode="contained" onPress={() => console.log('Pressed')}>
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
