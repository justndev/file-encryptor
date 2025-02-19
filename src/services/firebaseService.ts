import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const firebaseService = {
    /**
     * Logs in a user with email and password.
     */
    async login(email: string, password: string) {
        try {
            const credentials = await auth().signInWithEmailAndPassword(email, password);
            return credentials;
        } catch (error) {
            console.log(`Login failed: ${(error as Error).message}`);
            throw error;
        }
    },

    /**
     * Registers a new user with email and password.
     */
    async register(email: string, password: string) {
        try {
            return await auth().createUserWithEmailAndPassword(email, password);
        } catch (error) {
            console.log(`Registration failed: ${(error as Error).message}`);
            throw error;
        }
    },

    /**
     * Stores a file URL in Firestore.
     */
    async addFileUrlToFirestore(userId: string, fileUrl: string, fileName: string, fileSize: string) {
        try {
            const obj = { userId, fileUrl, fileName, fileSize, uploadedAt: new Date().toISOString() };
            const doc = await firestore().collection('fileUrls').add(obj);
            console.log('File URL added to Firestore');
            return doc.id;
        } catch (error) {
            console.log(`Firestore write failed: ${(error as Error).message}`);
            throw error;
        }
    },

    /**
     * Stores an encryption key in Firestore (linked to a file).
     */
    async storeEncryptionKey(userId: string, fileId: string, encryptionKey: string) {
        try {
            await firestore()
                .collection('encryptionKeys')
                .doc(fileId)
                .set({ userId, encryptionKey });

            console.log(`Encryption key stored for file ${fileId}`);
        } catch (error) {
            console.error(`Error storing encryption key: ${(error as Error).message}`);
            throw error;
        }
    },

    /**
     * Retrieves an encryption key from Firestore.
     */
    async getEncryptionKey(fileId: string): Promise<string> {
        try {
            console.log(`File id: ${fileId}`)
            const doc = await firestore().collection('encryptionKeys').doc(fileId).get();

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

    /**
     * Stores encryption metadata (IV & salt) for a file.
     */
    async storeFileEncryptionMetadata(userId: string, fileId: string, iv: string, salt: string) {
        try {
            await firestore()
                .collection('fileMetadata')
                .doc(fileId)
                .set({ userId, iv, salt });

            console.log(`Encryption metadata stored for file ${fileId}`);
        } catch (error) {
            console.error(`Error storing encryption metadata: ${(error as Error).message}`);
            throw error;
        }
    },

    /**
     * Retrieves encryption metadata (IV & salt) for a file.
     */
    async getFileEncryptionMetadata(fileId: string) {
        try {
            const doc = await firestore().collection('fileMetadata').doc(fileId).get();

            if (!doc.exists) {
                throw new Error('File metadata not found');
            }

            return doc.data();
        } catch (error) {
            console.error(`Error retrieving file metadata: ${(error as Error).message}`);
            throw error;
        }
    },

    /**
     * Deletes a file and its metadata from Firestore & Firebase Storage.
     */
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
            await firestore().collection('encryptionKeys').doc(documentId).delete();
            await firestore().collection('fileMetadata').doc(documentId).delete();

            console.log('File and document successfully deleted');
            return true;
        } catch (error) {
            console.error('Error deleting file and document:', (error as Error).message);
            throw error;
        }
    },

    /**
     * Retrieves all file links for a user.
     */
    async getFileLinksFromFirestore(userId: string) {
        if (!userId || userId === '') {
            console.error('User ID cannot be null');
            throw Error('Developer has down syndrome');
        }
        try {
            const querySnapshot = await firestore()
                .collection('fileUrls')
                .where('userId', '==', userId)
                .get();

            if (!querySnapshot.empty) {
                const docs = querySnapshot.docs.map(doc => ({ ...doc.data(), fileId: doc.id }));
                return docs;
            } else {
                console.log('No files found');
                return [];
            }
        } catch (error) {
            console.log(`Firestore read failed: ${(error as Error).message}`);
            throw error;
        }
    },
};

export default firebaseService;
