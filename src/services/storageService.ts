import RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer';


const storageService = {
  async downloadFile(fileUrl: string, fileName: string) {
    try {

      const filePath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
      console.log('Saving file to:', filePath);

      const options = {
        fromUrl: fileUrl,
        toFile: filePath,
        background: true,
        progress: (res: { bytesWritten: number; contentLength: number }) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progress.toFixed(2)}%`);
        },
      };

      const response = await RNFS.downloadFile(options).promise;

      if (response.statusCode === 200) {
        const fileExists = await RNFS.exists(filePath);
        console.log('File exists after download:', fileExists);

        return filePath;
      } else {
        throw new Error('Download failed with status: ' + response.statusCode);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
};

export default storageService;
