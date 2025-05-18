import { encryptionUtils } from "../utils/encryptionUtils";
import { fileTransformerUtils } from "../utils/fileTransformUtils";
import RNFS from 'react-native-fs';

class AppService {

    async encryptFileAesCbc(file:any, key: string) {    
        if (!encryptionUtils.isValidBase64(key)) throw Error('Invalid key provided. Need Base64 256 bits length')    
            
        const string = await fileTransformerUtils.fileToString(file.uri);
        const encryptedString = await encryptionUtils.encryptString(string, key);
        const fileContainingStringUri = await fileTransformerUtils.saveStringAsTextFile(encryptedString, file.name)
        return fileContainingStringUri;
    }

    async decryptFileAesCbc(file:any, key: string) {
        if (!encryptionUtils.isValidBase64(key)) throw Error('Invalid key provided. Need Base64 256 bits length')    

        const originalFilename = (file.uri.split('/').pop());
        const newFilename = originalFilename.slice(0, -4);
        const destinationUri = `${RNFS.ExternalDirectoryPath}/${newFilename}`;
        const encryptedStringBack = await fileTransformerUtils.readStringFromTextFile(file.uri)
        const decryptedStringBack = await encryptionUtils.decryptString(encryptedStringBack, key);
        const newFileUri = await fileTransformerUtils.stringToFile(decryptedStringBack, destinationUri);
        return newFileUri;
    }
}

export const appService = new AppService()