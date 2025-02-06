import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob';
import EncryptionService from './EncryptionService';

export const FileService = {
  stringToTextFile(content: string | Blob, fileName: string) {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      return new File([blob], `${fileName}.txt`, { type: 'text/plain' });
    } catch (error: any) {
      throw new Error('Failed to convert string to text file: ' + error.message);
    }
  },

  textFileToString(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.type !== 'text/plain') {
        reject(new Error('File must be a text file'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read text file'));
        }
      };
      reader.onerror = (error) => {
        reject(new Error('Error reading text file: ' + error));
      };
      reader.readAsText(file);
    });
  },

  imageToString(imageFile: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to string'));
        }
      };
      reader.onerror = (error) => {
        reject(new Error('Error reading image file: ' + error));
      };
      reader.readAsDataURL(imageFile);
    });
  },
  stringToImage(base64String: string, fileName = 'image') {
    try {
      const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string format');
      }
      const mimeType = matches[1];
      const base64Data = matches[2];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: mimeType });
      const extension = mimeType.split('/')[1] || 'jpg';
      return new File([blob], `${fileName}.${extension}`, { type: mimeType });
    } catch (error: any) {
      throw new Error('Failed to convert string to image: ' + error.message);
    }
  },

  fileToString(file: File): Promise<{ content: string; fileType: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          console.log('File read successfully, type:', file.type);
          console.log('Result starts with:', reader.result.substring(0, 50) + '...');

          resolve({
            content: reader.result,
            fileType: file.type
          });
        } else {
          reject(new Error('FileReader result is not a string'));
        }
      };

      reader.onerror = (error) => {
        reject(new Error(`Error reading file: ${error}`));
      };

      reader.readAsDataURL(file);
    });
  },

  stringToFile(fileString: string, fileName: string, fileType: string): File {
    try {
      console.log('Converting string to file...');
      console.log('File type:', fileType);
      console.log('String preview:', fileString.substring(0, 50) + '...');

      if (!fileString) {
        throw new Error('File string is empty');
      }

      if (!fileString.startsWith('data:')) {
        fileString = `data:${fileType};base64,${fileString}`;
      }

      const matches = fileString.match(/^data:(.+?)(;base64)?,(.+)$/);

      if (!matches) {
        console.error('Failed to parse data URL. String starts with:', fileString.substring(0, 100));
        throw new Error('Invalid data URL format');
      }

      const actualFileType = matches[1] || fileType;
      let base64Data = matches[3];

      const paddingLength = 4 - (base64Data.length % 4);
      if (paddingLength !== 4) {
        base64Data += '='.repeat(paddingLength);
      }

      try {
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        const sliceSize = 8192;

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
          const byteNumbers = new Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          byteArrays.push(new Uint8Array(byteNumbers));
        }

        console.log('Successfully created byte arrays');
        const blob = new Blob(byteArrays, { type: actualFileType });
        return new File([blob], fileName, { type: actualFileType });
      } catch (e: any) {
        console.error('Error in base64 decoding:', e);
        throw new Error(`Base64 decoding failed: ${e.message}`);
      }
    } catch (error: any) {
      console.error('Full error details:', error);
      throw new Error(`Failed to convert string to file: ${error.message}`);
    }
  },

  async downloadAndSaveFile(fileUrl: string, filename: string, secretKey: string) {
    try {
      if (Platform.OS === 'android') {
        await this.askWriteExternalStoragePermission();
      }
  
      const downloadDir = RNFS.DocumentDirectoryPath
      const filePath = `${downloadDir}/${filename}`;
      console.log('log1')
      // Download file
      const downloadResponse = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: filePath,
        background: true,
        discretionary: true,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Progress: ${progress.toFixed(2)}%`);
        },
      }).promise;
     

      if (downloadResponse.statusCode !== 200) {
        throw new Error(`Download failed with status code ${downloadResponse.statusCode}`);
      }
  
      console.log('File downloaded successfully:', filePath);
  
      // Read the downloaded file in base64 format
      const encryptedContent = await RNFS.readFile(filePath, 'base64');
      console.log(encryptedContent)
      // Decrypt the file content
      const decryptedContent = EncryptionService.decryptFile(encryptedContent, secretKey);
      return
  
      if (!decryptedContent) {
        throw new Error('Decryption failed. Check the secret key.');
      }
  
      // Save the decrypted content back to the same file
      await RNFS.writeFile(filePath, decryptedContent, 'utf8');
  
      console.log('Decrypted file saved at:', filePath);
      return filePath;
    } catch (error) {
      console.error('File download and decryption failed:', error);
      throw error;
    }
  },  

  getDownloadDir() {
    if (Platform.OS === 'ios') {
      return RNFetchBlob.fs.dirs.DocumentDir
    };
    return RNFetchBlob.fs.dirs.DownloadDir;
  },

  async askWriteExternalStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to download files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission denied');
        throw new Error('Storage permission denied');
      }

      console.log('Permission granted successfully');
    } catch (permissionError) {
      console.error('Error requesting permission:', permissionError);
      throw new Error(`Permission request failed: ${permissionError.message}`);
    }

  }
};

export default FileService;