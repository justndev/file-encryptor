import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Button, Portal } from 'react-native-paper';
import CustomIcon from '../components/CustomIcon';
import { icons } from '../utils/icons';
import FilesContainer from '../components/FilesContainer';
import FileCard from '../components/FileCard';

const LibraryScreen = () => {
  const [isEditMode, setEditMode] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function displayTopButtons() {
    if (isEditMode) return <View>
      <Button mode="contained" onPress={() => console.log('Pressed')}>
        Cancel
      </Button>
      <Button mode="contained" onPress={() => console.log('Pressed')}>
        Delete
      </Button>

    </View>
    else return <View>
      <Button mode="contained" onPress={() => console.log('Pressed')}>
        Edit
      </Button>
    </View>
  }

  return (
    <View style={styles.container}>
      {displayTopButtons()}
      <FilesContainer files={[]} />
      <Portal>
        <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={containerStyle}>
          <FileCard link={undefined} filename='' />
          <View>
            <CustomIcon source={icons.cross} size={25} onPress={()=>console.log('Pressed')}/>
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

const containerStyle = { backgroundColor: 'white', padding: 20 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
});

export default LibraryScreen;