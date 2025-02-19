import { PermissionsAndroid, Platform } from 'react-native';

const permissionRequests = {
  async checkReadPermission() {
    if (Platform.OS === 'android') {
      const deviceVersion = parseInt(Platform.Version as string, 10);
      let permission;

      if (deviceVersion >= 13) {
        permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
      } else {
        permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
      }

      return permission === PermissionsAndroid.RESULTS.GRANTED;
    };
    return true;
  }
};

export default permissionRequests;
