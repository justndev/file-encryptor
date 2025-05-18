import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

/**
 * Service for transforming files to strings and back in React Native
 * (for non-Expo projects)
 */
class FileTransformerUtils {
  /**
   * Convert a file to a base64 string
   * @param {string} fileUri - URI of the file to convert
   * @returns {Promise<string>} - Promise resolving to base64 string
   */
  async fileToString(fileUri) {
    try {
      // Check if the file exists
      const exists = await RNFS.exists(fileUri);
      if (!exists) {
        throw new Error(`File doesn't exist at path: ${fileUri}`);
      }
      
      // Read the file as base64
      const base64String = await RNFS.readFile(fileUri, 'base64');
      return base64String;
    } catch (error) {
      console.error('Error converting file to string:', error);
      throw error;
    }
  }

  /**
   * Convert a base64 string back to a file
   * @param {string} base64String - Base64 string to convert
   * @param {string} destinationUri - URI where the file should be saved
   * @param {string} mimeType - Optional MIME type of the file (for metadata)
   * @returns {Promise<string>} - Promise resolving to the URI of the saved file
   */
  async stringToFile(base64String, destinationUri) {
    try {
      // Ensure the directory exists
      const directory = destinationUri.substring(0, destinationUri.lastIndexOf('/'));
      const exists = await RNFS.exists(directory);
      if (!exists) {
        await RNFS.mkdir(directory);
      }
      
      // Write the base64 string to a file
      await RNFS.writeFile(destinationUri, base64String, 'base64');
      return destinationUri;
    } catch (error) {
      console.error('Error converting string to file:', error);
      throw error;
    }
  }

  /**
   * Save a base64 string (representing a file) as a text file with filename.ext.txt format
   * @param {string} base64String - Base64 string to save
   * @param {string} originalFilename - Original filename to use for creating the text filename
   * @param {string} [directory] - Optional directory to save in (defaults to documents directory)
   * @returns {Promise<string>} - Promise resolving to the URI of the saved text file
   */
  async saveStringAsTextFile(base64String, originalFilename) {
    try {
      // Ensure we have a valid directory
      
      // Create the filename.ext.txt format
      const textFilename = `${originalFilename}.enc`;
      const destinationUri = `${RNFS.ExternalDirectoryPath}/${textFilename}`;
      
      // Write the base64 string to a text file as plain text
      await RNFS.writeFile(destinationUri, base64String, 'utf8');
      
      return destinationUri;
    } catch (error) {
      console.error('Error saving string as text file:', error);
      throw error;
    }
  }

  /**
   * Read a text file containing a base64 string and return the string
   * @param {string} textFileUri - URI of the text file containing the base64 string
   * @returns {Promise<string>} - Promise resolving to the base64 string
   */
  async readStringFromTextFile(textFileUri) {
    try {
      // Check if the file exists
      const exists = await RNFS.exists(textFileUri);
      if (!exists) {
        throw new Error(`Text file doesn't exist at path: ${textFileUri}`);
      }
      
      // Read the text file as UTF-8
      const base64String = await RNFS.readFile(textFileUri, 'utf8');
      return base64String;
    } catch (error) {
      console.error('Error reading string from text file:', error);
      throw error;
    }
  }

  /**
   * Extract the original filename from a text file with filename.ext.txt format
   * @param {string} textFilePath - Path to the text file
   * @returns {string} - Original filename without the .txt extension
   */
  getOriginalFilenameFromTextFile(textFilePath) {
    const textFilename = textFilePath.split('/').pop();
    // Remove the .txt extension to get the original filename.ext
    return textFilename.endsWith('.txt') 
      ? textFilename.slice(0, -4) 
      : textFilename;
  }

  /**
   * Complete workflow to convert file to text file and back
   * @param {string} fileUri - URI of the original file
   * @returns {Promise<{textFileUri: string, originalFilename: string}>} - Text file URI and original filename
   */
  async fileToTextFile(fileUri) {
    try {
      // Get original filename
      const originalFilename = fileUri.split('/').pop();
      
      // Convert file to base64 string
      const base64String = await this.fileToString(fileUri);
      
      // Save base64 string as text file
      const textFileUri = await this.saveStringAsTextFile(base64String, originalFilename);
      
      return {
        textFileUri,
        originalFilename
      };
    } catch (error) {
      console.error('Error in file to text file workflow:', error);
      throw error;
    }
  }

  /**
   * Complete workflow to convert text file back to original file
   * @param {string} textFileUri - URI of the text file
   * @param {string} [outputDirectory] - Optional directory to save the restored file
   * @returns {Promise<string>} - URI of the restored file
   */
  async textFileToFile(textFileUri, outputDirectory = null) {
    try {
      // Get the original filename from the text file name
      const originalFilename = this.getOriginalFilenameFromTextFile(textFileUri);
      
      // Read the base64 string from the text file
      const base64String = await this.readStringFromTextFile(textFileUri);
      
      // Determine output directory
      const targetDir = outputDirectory || this.getDirectories().documents;
      
      // Create destination URI for the restored file
      const destinationUri = `${targetDir}/${originalFilename}`;
      
      // Convert the base64 string back to a file
      return await this.stringToFile(base64String, destinationUri);
    } catch (error) {
      console.error('Error in text file to file workflow:', error);
      throw error;
    }
  }

  /**
   * Utility method to get a MIME type from a file extension
   * @param {string} fileUri - URI of the file
   * @returns {string} - MIME type or empty string if unknown
   */
  getMimeType(fileUri) {
    const extension = fileUri.split('.').pop().toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'json': 'application/json',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      // Add more as needed
    };
    
    return mimeTypes[extension] || '';
  }

  /**
   * Get file metadata
   * @param {string} fileUri - URI of the file
   * @returns {Promise<Object>} - Promise resolving to file metadata
   */
  async getFileMetadata(fileUri) {
    try {
      const stats = await RNFS.stat(fileUri);
      return {
        ...stats,
        mimeType: this.getMimeType(fileUri),
        fileName: fileUri.split('/').pop()
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }

  /**
   * Get common directories for file storage
   * @returns {Object} - Object with common directory paths
   */
  getDirectories() {
    return {
      documents: Platform.select({
        ios: RNFS.DocumentDirectoryPath,
        android: RNFS.DocumentDirectoryPath,
      }),
      cache: Platform.select({
        ios: RNFS.CachesDirectoryPath,
        android: RNFS.CachesDirectoryPath,
      }),
      external: Platform.select({
        ios: RNFS.DocumentDirectoryPath,
        android: RNFS.ExternalDirectoryPath,
      }),
      pictures: Platform.select({
        ios: `${RNFS.DocumentDirectoryPath}/Pictures`,
        android: RNFS.PicturesDirectoryPath,
      }),
    };
  }
}

export const fileTransformerUtils = new FileTransformerUtils();