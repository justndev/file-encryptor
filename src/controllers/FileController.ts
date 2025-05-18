import { Platform } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import permissionRequests from '../utils/permissionRequests';


export class FileController {
  async pickDocument(): Promise<DocumentPickerResponse | null> {
    try {
      const hasPermission = await permissionRequests.checkReadPermission();
      if (!hasPermission) {
        throw new Error('Storage access is required to pick a file.');
      }
      
      // Use try/catch with await to ensure activity context is maintained
      try {
        const result = await DocumentPicker.pickSingle({ 
          type: [DocumentPicker.types.allFiles],
          // Make sure to handle the activity properly
          presentationStyle: 'fullScreen',
          copyTo: 'cachesDirectory'
        });
        
        let filePath = result.uri;
        
        // For Android, handle content URIs by copying to a temporary location
        if (Platform.OS === 'android' && filePath.startsWith('content://')) {
          const newPath = `${RNFS.TemporaryDirectoryPath}/${result.name}`;
          await RNFS.copyFile(filePath, newPath);
          filePath = newPath;
        }
        
        return { ...result, uri: filePath };
      } catch (innerError) {
        if (DocumentPicker.isCancel(innerError)) {
          return null;
        }
        throw innerError;
      }
    } catch (error) {
      console.error('Error picking file:', error);
      throw error;
    }
  }

  async encryptFile() {

  }

  async decryptFile() {
    
  }
}

export const fileController = new FileController();
