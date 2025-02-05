import { PermissionsAndroid, Platform } from 'react-native';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';

export const FileService = {
    stringToTextFile(content: BlobPart, fileName: string) {
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
  
    async downloadAndSaveFile(fileUrl, filename)  {
      try {
        // Request storage permission on Android
        if (Platform.OS === 'android') {
          console.log('Requesting Android storage permission...');
          try {
            const result = await requestMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
            console.log(result)
            console.log('and?')
            // const granted = await PermissionsAndroid.request(
            //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            //   {
            //     title: 'Storage Permission',
            //     message: 'App needs access to storage to download files.',
            //     buttonNeutral: 'Ask Me Later',
            //     buttonNegative: 'Cancel',
            //     buttonPositive: 'OK',
            //   }
            // );
            
            // console.log('Permission request result:', granted);
            
            // if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            //   console.log('Permission denied');
            //   throw new Error('Storage permission denied');
            // }
            
            // console.log('Permission granted successfully');
          } catch (permissionError) {
            console.error('Error requesting permission:', permissionError);
            throw new Error(`Permission request failed: ${permissionError.message}`);
          }
        }
    
        // Get the device's download directory path
        const downloadDir = Platform.OS === 'ios' 
          ? RNFetchBlob.fs.dirs.DocumentDir 
          : RNFetchBlob.fs.dirs.DownloadDir;
        
        console.log('Download directory:', downloadDir);
    
        // Configure the download
        const response = await RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${downloadDir}/${filename}`,
            description: 'Downloading file...',
          },
          path: `${downloadDir}/${filename}` // for iOS
        }).fetch('GET', fileUrl);
    
        console.log('Download completed:', response.path());
        return response.path();
    
      } catch (error) {
        console.error('Download error:', error);
        throw error;
      }
    },

    isSupportedFileType(fileType: string): boolean {
      // Add any file type restrictions here if needed
      return true; // Currently supporting all file types
    }
  };
  
  export default FileService;