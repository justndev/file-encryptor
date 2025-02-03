import CryptoJS from "react-native-crypto-js";

const EncryptionService = {
    generateKey() {
        const randomKey = CryptoJS.lib.WordArray.random(32);
        return CryptoJS.enc.Base64.stringify(randomKey);
    },
    encryptFile(plainText: string, secretKey: string): string {
        const cipherText: string = CryptoJS.AES.encrypt(plainText, secretKey).toString();
        return cipherText;
    },
    decryptFile(cipherText: string, secretKey: string): string {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
        const plainText: string = bytes.toString(CryptoJS.enc.Utf8);
        return plainText;
    },
};

export default EncryptionService;
