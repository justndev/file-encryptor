import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { setUser } from '../redux/userSlice';
import { CommonActions } from '@react-navigation/native';

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
    async addFileUrlToFirestore(userId: string, fileUrl: string, fileName: string, fileSize: string, iv: any, salt: any) {
        try {
            const obj = { userId, fileUrl, fileName, fileSize, uploadedAt: new Date().toISOString(), iv, salt };
            const doc = await firestore().collection('fileUrls').add(obj);
            console.log('File URL added to Firestore');
            return doc.id;
        } catch (error) {
            console.log(`Firestore write failed: ${(error as Error).message}`);
            throw error;
        }
    },
    async storeEncryptionKey(userId: string, encryptionKey: string) {
        try {
            await firestore()
                .collection('encryption_keys')
                .doc(userId)
                .set({ encryptionKey });

            console.log(`Encryption key stored for user ${userId} in encryption_keys`);
        } catch (error) {
            console.error(`Error storing encryption key: ${(error as Error).message}`);
            throw error;
        }
    },
    async getEncryptionKey(userId: string): Promise<string> {
        try {
            const doc = await firestore().collection('encryption_keys').doc(userId).get();

            if (!doc.exists) {
                throw new Error('Encryption key not found');
            }

            const data = doc.data();
            return data?.encryptionKey;
        } catch (error) {
            console.error(`Error retrieving encryption key: ${(error as Error).message}`);
            throw error;
        }
    },
    async deleteFileAndDocument(documentId: string, folderPath = 'uploads/') {
        try {
            const documentSnapshot = await firestore().collection('fileUrls').doc(documentId).get();

            if (!documentSnapshot.exists) {
                throw new Error('Document not found');
            }

            const fileData = documentSnapshot.data();

            if (!fileData) {
                throw new Error('No file data found');
            }

            const fileName = fileData.fileName;
            const reference = storage().ref(`${folderPath}${fileName}`);
            await reference.delete();

            await firestore().collection('fileUrls').doc(documentId).delete();

            console.log('File and document successfully deleted');
            return true;
        } catch (error) {
            console.error('Error deleting file and document:', (error as Error).message);
            throw error;
        }
    },
    async getFileLinksFromFirestore(userId: string) {
        if (!userId || userId.trim() === '') {
            throw new Error('Invalid user ID provided');
        }
        try {
            const querySnapshot = await firestore()
                .collection('fileUrls')
                .where('userId', '==', userId)
                .get();

            if (!querySnapshot.empty) {
                return querySnapshot.docs.map(doc => ({ ...doc.data(), fileId: doc.id }));
            } else {
                console.log('No files found');
                return [];
            }
        } catch (error) {
            console.log(`Firestore read failed: ${(error as Error).message}`);
            throw error;
        }
    },
    logout(navigation, dispatch) {
        auth()
            .signOut()
            .then(() => {
                dispatch(setUser(null)); // Clear user state

                // Reset navigation stack to Welcome screen
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                    })
                );
            })
            .catch((error) => console.error('Logout failed:', error));
    }
};

export default firebaseService;
