import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomIcon from '../components/CustomIcon';
import FileCard from '../components/FileCard';
import { icons } from '../utils/icons';
import { Button } from 'react-native-paper';

const EncryptionScreen = () => {
  const [selectedFile, setSelectedFile] = useState()

  return (
    <View style={styles.container}>
      {
        selectedFile ?
          <View>
            <CustomIcon source={icons.cross} size={25} onPress={() => console.log('Pressed')} />
            <FileCard link={undefined} filename='' />
            <View>
              <Button mode="contained" onPress={() => console.log('Pressed')}>
                Encrypt & Upload
              </Button>
            </View>
          </View>
          :
          <View>

            <Button mode="contained" onPress={() => console.log('Pressed')}>
              Select File
            </Button>
          </View>
      }
    </View>
  );
};

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

export default EncryptionScreen;
