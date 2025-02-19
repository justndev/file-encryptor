import RNEncryptionModule from "@dhairyasharma/react-native-encryption";

export class EncryptionService {

  generateEncryptionKey(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  async encryptFile(inputFilePath: string, outputEncryptedFilePath: string, key: string) {
    try {
      return RNEncryptionModule.encryptFile(
        inputFilePath,
        outputEncryptedFilePath,
        key
      ).then((res: any) => {
          if (res.status == "success") {
              console.log("success", res)
              return res
          } else {
              console.log("error", res);
              throw Error
          }
          }).catch((err: any) => {
              console.log(err);
          });
    } catch (error) {
      console.error("File encryption error:", error);
      throw error;
    }
  }

  async decryptFile(encryptedFilePath: string, outputDecryptedFilePath: string, key: string, iv: string, salt: string) {
    try {
      RNEncryptionModule.decryptFile(
        encryptedFilePath,
        outputDecryptedFilePath,
        key,
        iv,
        salt
      ).then((res: any) => {
          if (res.status == "success") {
              console.log("success", res)
          } else {
              console.log("error", res);
          }
          }).catch((err: any) => {
              console.log(err);
          });
    } catch (error) {
      console.error("File decryption error:", error);
      throw error;
    }
  }
}

export const encryptionService = new EncryptionService();
