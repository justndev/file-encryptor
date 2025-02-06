// permissionRequests.js
import { PermissionsAndroid, Platform } from 'react-native';

const permissionRequests = {
  async checkFileReadPermission() {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions through Info.plist
    }
  
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'File Read Permission',
          message: 'App needs access to read files from your device.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
  
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting read permission:', err);
      return false;
    }
  },
  
  async checkFileWritePermission() {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions through Info.plist
    }
  
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'File Write Permission',
          message: 'App needs access to save files to your device.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
  
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting write permission:', err);
      return false;
    }
  }
}

export default permissionRequests;
