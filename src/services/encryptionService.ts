import RNEncryptionModule from "@dhairyasharma/react-native-encryption";
import { randomBytes } from "react-native-randombytes";

export class EncryptionService {
  /**
   * Generates a secure encryption key, IV, and salt.
   * @returns {Promise<{ encryptionKey: string; iv: string; salt: string }>}
   */
  async generateEncryptionMetadata() {
    return new Promise((resolve, reject) => {
      randomBytes(32, (err, keyBuffer) => {
        if (err) {
          reject("Error generating encryption key");
        } else {
          randomBytes(16, (err, ivBuffer) => {
            if (err) {
              reject("Error generating IV");
            } else {
              randomBytes(16, (err, saltBuffer) => {
                if (err) {
                  reject("Error generating salt");
                } else {
                  resolve({
                    encryptionKey: keyBuffer.toString("base64"),
                    iv: ivBuffer.toString("base64"),
                    salt: saltBuffer.toString("base64"),
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  /**
   * Encrypts text using a given key.
   */
  async encryptText(plainText: string, key: string) {
    try {
      const result = await RNEncryptionModule.encryptText(plainText, key);
      if (result.status === "success") {
        return { encryptedText: result.encryptedText, iv: result.iv, salt: result.salt };
      } else {
        throw new Error("Text encryption failed");
      }
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  /**
   * Decrypts text using a given key.
   */
  async decryptText(encryptedText: string, key: string, iv: string, salt: string): Promise<string> {
    try {
      const result = await RNEncryptionModule.decryptText(encryptedText, key, iv, salt);
      if (result.status === "success") {
        return result.decryptedText;
      } else {
        throw new Error("Text decryption failed");
      }
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }

  /**
   * Encrypts a file.
   */
  async encryptFile(inputFilePath: string, outputEncryptedFilePath: string, key: string) {
    try {
      return RNEncryptionModule.encryptFile(
        inputFilePath,
        outputEncryptedFilePath,
        'password'
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

  /**
   * Decrypts a file.
   */
  async decryptFile(encryptedFilePath: string, outputDecryptedFilePath: string, key: string, iv: string, salt: string) {
    try {
      RNEncryptionModule.decryptFile(
        encryptedFilePath,
        outputDecryptedFilePath,
        'password',
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

// Export singleton instance
export const encryptionService = new EncryptionService();
