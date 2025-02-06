import storage from '@react-native-firebase/storage';
import * as FileSystem from 'react-native-fs';
import { Platform } from 'react-native';
import permissionRequests from './permissionRequests';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'

// Claude AI

const storageService = {
  async pickFile (){
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      return {
        uri: result[0].uri,
        name: result[0].name,
        type: result[0].type,
        size: result[0].size,
      };
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        throw new Error('User cancelled file picking');
      } else {
        throw new Error('Error picking file: ' + (error as Error).message);
      }
    }
  },
  
  async uploadFile(fileUri: string, fileName: any, folderPath = 'uploads/') {
    try {
      const hasPermission = await permissionRequests.checkFileReadPermission();
      if (!hasPermission) {
        throw new Error('Read permission not granted');
      }
  
      const reference = storage().ref(`${folderPath}${fileName}`);
      
      await reference.putFile(fileUri);
      
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      throw new Error('Error uploading file: ' + (error as Error).message);
    }
  },
  
  async downloadFile(fileUrl: string, fileName: string) {
    try {
      const hasPermission = await permissionRequests.checkFileWritePermission();
      if (!hasPermission) {
        throw new Error('Write permission not granted');
      }
      
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: fileUrl,
        toFile: filePath,
        background: true,
        begin: (res: any) => {
          console.log('Download started:', res);
        },
        progress: (res: { bytesWritten: number; contentLength: number; }) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progress.toFixed(2)}%`);
        },
      };
  
      const response = await FileSystem.downloadFile(options).promise;
      
      if (response.statusCode === 200) {
        return filePath;
      } else {
        throw new Error('Download failed with status: ' + response.statusCode);
      }
    } catch (error) {
      const errMsg = 'Error downloading file: ' + (error as Error).message;
      console.log(errMsg)
      throw new Error(errMsg);
    }
  }
}

export default storageService;