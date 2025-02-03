import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';


const FirebaseService = {
    async login(email: string, password: string) {
        try {
            const credentials = await auth().signInWithEmailAndPassword(email, password);
            return credentials;
        } catch (error) {
            console.log(`Login failed: ${error.message}`);
            throw error;
        }
    },

    async register(email: string, password: string) {
        try {
            return await auth().createUserWithEmailAndPassword(email, password);
        } catch (error) {
            console.log(`Registration failed: ${error.message}`);
            throw error;
        }
    },

    async addFileUrlToFirestore(userId: string, fileUrl: string, fileName: string, fileSize: string) {
        try {
            const obj = {userId, fileUrl, fileName: '', fileSize: '', uploadedAt: new Date().toISOString()}
            await firestore().collection('fileUrls').add(obj);
            console.log('File url added to Firestore');
        } catch (error) {
            console.log(`Firestore write failed: ${error.message}`);
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
                return querySnapshot.docs.map(doc => doc.data());
            } else {
                return [];
            }
        } catch (error) {
            console.log(`Firestore read failed: ${error.message}`);
            throw error;
        }
    },

    async uploadFile(filePath: any, fileName: any) {
        try {
            const reference = storage().ref(fileName);
            await reference.putFile(filePath);
            const url = await reference.getDownloadURL();
            console.log('File uploaded:', url);
            return url;
        } catch (error) {
            console.log(`File upload failed: ${error.message}`);
            throw error;
        }
    },

    async getFileDownloadUrl(fileName: any) {
        try {
            const url = await storage().ref(fileName).getDownloadURL();
            return url;
        } catch (error) {
            console.log(`Get file URL failed: ${error.message}`);
            throw error;
        }
    },

};

export default FirebaseService;
