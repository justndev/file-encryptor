import { Platform } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import firebaseService from '../services/firebaseService';
import permissionRequests from '../services/permissionRequests';
import storageService from '../services/storageService';
import { encryptionService } from '../services/encryptionService';

interface FileInfo {
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileId?: string;
}

export class FileController {
  async pickDocument(): Promise<DocumentPickerResponse | null> {
    try {
      const hasPermission = await permissionRequests.checkReadPermission();
      if (!hasPermission) {
        throw new Error('Storage access is required to pick a file.');
      }

      const result = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] });

      let filePath = result.uri;
      if (Platform.OS === 'android' && filePath.startsWith('content://')) {
        const newPath = `${RNFS.TemporaryDirectoryPath}/${result.name}`;
        await RNFS.copyFile(filePath, newPath);
        filePath = newPath;
      }

      return { ...result, uri: filePath };
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error picking file:', error);
        throw error;
      }
      return null;
    }
  }

  async uploadFile(userId: string, fileUri: string, fileName: string, fileSize: string): Promise<void> {
    try {
      const encryptedFilePath = `${RNFS.TemporaryDirectoryPath}/${fileName}.enc`;

      const encryptionKey = await firebaseService.getEncryptionKey(userId);

      const {success, iv, salt} = await encryptionService.encryptFile(fileUri, encryptedFilePath, encryptionKey);

      const reference = storage().ref(`uploads/${fileName}.enc`);
      await reference.putFile(encryptedFilePath.replace('file://', ''));
      const url = await reference.getDownloadURL();

      await firebaseService.addFileUrlToFirestore(userId, url, fileName, fileSize, iv, salt);

      console.log(`File ${fileName} uploaded & encrypted successfully.`);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
   extractFileIdFromUrl(fileUrl: string): string {
    const urlParts = fileUrl.split('?')[0];
    const pathParts = urlParts.split('/');
    
    const fileId = pathParts[pathParts.length - 1];
    
    console.log(`Extracted fileId: ${fileId}`);
    return fileId;
  }

  async downloadFile(userId: string, fileUrl: string, fileName: string, iv: any, salt: any): Promise<string> {
    try {
      const encryptionKey = await firebaseService.getEncryptionKey(userId);

      if (!encryptionKey || !iv || !salt) {
        
        throw new Error('Missing encryption details.');
      }

      const encryptedFilePath = await storageService.downloadFile(fileUrl, `${fileName}.enc`);

      const decryptedFilePath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
      await encryptionService.decryptFile(encryptedFilePath, decryptedFilePath, encryptionKey, iv, salt);

      try {
        await RNFS.unlink(encryptedFilePath);
        console.log(`Encrypted file deleted: ${encryptedFilePath}`);
      } catch (deleteError) {
        console.warn(`Failed to delete encrypted file: ${encryptedFilePath}`, deleteError);
      }
      
      console.log(`File ${fileName} downloaded & decrypted successfully.`);
      return decryptedFilePath;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await firebaseService.deleteFileAndDocument(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getUserFiles(userId: string): Promise<FileInfo[]> {
    try {
      return await firebaseService.getFileLinksFromFirestore(userId);
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }
}

export const fileController = new FileController();
