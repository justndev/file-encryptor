import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import FileService from './FileService';
import EncryptionService from './EncryptionService';
import RNFS from 'react-native-fs';


const firebaseService = {
    async login(email: string, password: string) {
        try {
            const credentials = await auth().signInWithEmailAndPassword(email, password);
            return credentials;
        } catch (error) {
            console.log(`Login failed: ${(error as Error).message}`);
            throw error;
        }
    },

    async register(email: string, password: string) {
        try {
            return await auth().createUserWithEmailAndPassword(email, password);
        } catch (error) {
            console.log(`Registration failed: ${(error as Error).message}`);
            throw error;
        }
    },

    async addFileUrlToFirestore(userId: string, fileUrl: string, fileName: string, fileSize: string) {
        try {
            const obj = {userId, fileUrl, fileName, fileSize, uploadedAt: new Date().toISOString()}
            await firestore().collection('fileUrls').add(obj);
            console.log('File url added to Firestore');
        } catch (error) {
            console.log(`Firestore write failed: ${(error as Error).message}`);
            throw error;
        }
    },
    async deleteFileAndDocument(documentId: string, folderPath = 'uploads/') {
        try {
          const documentSnapshot = await firestore()
            .collection('fileUrls')
            .doc(documentId)
            .get();
      
          if (!documentSnapshot.exists) {
            throw new Error('Document not found');
          }
      
          const fileData = documentSnapshot.data();
          
          if (!fileData) {
            throw new Error('No file data found');
          }
      
          // Delete file from Firebase Storage
          const fileName = fileData.fileName;
          const reference = storage().ref(`${folderPath}${fileName}`);
          await reference.delete();
      
          // Delete document from Firestore
          await firestore()
            .collection('fileUrls')
            .doc(documentId)
            .delete();
      
          console.log('File and document successfully deleted');
          return true;
        } catch (error) {
          console.error('Error deleting file and document:', (error as Error).message);
          throw error;
        }
      },

    async getFileLinksFromFirestore(userId: string) {
        try {
            const querySnapshot = await firestore()
                .collection('fileUrls')
                .where('userId', '==', userId)
                .get();
            
            if (!querySnapshot.empty) {
                const docs =  querySnapshot.docs.map(doc => ({...doc.data(), fileId: doc.id}));
                
                return docs;

            } else {
                console.log('empty')
                return [];
            }
        } catch (error) {
            console.log(`Firestore read failed: ${(error as Error).message}`);
            throw error;
        }
    },

    async uploadFile(file: any, fileName: string, fileSize: string, secretKey: string, userId: string) {
        try {
            const content = await RNFS.readFile(file.uri, 'base64');
            const encryptedContent = EncryptionService.encryptFile(content, secretKey);
            const decryptedContent = EncryptionService.decryptFile(encryptedContent, secretKey)
            
            // Convert encrypted string to Blob
            const blob = new Blob([encryptedContent], { type: 'text/plain' });
    
            // Upload using put (not putFile)
            const reference = storage().ref(fileName);
            await reference.put(blob);
    
            // Get download URL
            const url = await reference.getDownloadURL();
            this.addFileUrlToFirestore(userId, url, fileName, fileSize)
            console.log('File uploaded:', url);
            return url;
        } catch (error) {
            console.log(`File upload failed: ${(error as Error).message}`);
            console.log(error)
            throw error;
        }
    },
};

export default firebaseService;
