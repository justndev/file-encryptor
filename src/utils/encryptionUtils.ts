import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import { randomBytes } from 'react-native-randombytes';

import CryptoAesCbc from 'react-native-crypto-aes-cbc';

const secretKey = '12345678901111111234567890111111';
const iv = '1111111234567890';
const secretKeyInBASE64 = 'MTIzNDU2Nzg5MDExMTExMTEyMzQ1Njc4OTAxMTExMTE=';
const ivInBASE64 = 'MTExMTExMTIzNDU2Nzg5MA==';
const keysize128 = '128';
const keysize256 = '256';
const text = 'Sachin Agrawal';


export class EncryptionUtils {
  private externalDirectory: string;

  constructor() {
    this.externalDirectory = Platform.OS === 'android'
      ? RNFS.ExternalDirectoryPath
      : RNFS.DocumentDirectoryPath;
  }

  public async generateKey(keyLength: 128 | 192 | 256 = 256): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        randomBytes(keyLength / 8, (error, bytes) => {
          if (error) {
            reject(error);
            return;
          }

          // Convert bytes to hex string
          const key = Buffer.from(bytes).toString('hex');
          resolve(key);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public async generateBase64Key(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(32, (err, bytes) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(Buffer.from(bytes).toString('base64'));
      });
    });
  };

async encryptString(text: string, key: string) {
  return CryptoAesCbc.encryptInBase64(
    ivInBASE64,
    key,
    text,
    '256'
  ).then((encryptString) => {
    console.log(encryptString);
    return encryptString
  });
}

async decryptString(text: string, key: string) {
  return CryptoAesCbc.decryptByBase64(
    ivInBASE64,
    key,
    text,
    '256'
  ).then((decryptString) => {
    console.log(decryptString);
    return decryptString;
  });
};

isValidBase64 = (key: string): boolean => {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  console.log(`key ${key}`)
  return base64Regex.test(key) && key.length % 4 === 0;
};


}

export const encryptionUtils = new EncryptionUtils();