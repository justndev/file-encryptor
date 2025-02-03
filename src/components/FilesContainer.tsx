// FilesContainer.js
import { StyleSheet, View } from "react-native";
import FileCard from "./FileCard";

const FilesContainer = ({files}) => {
  function renderFiles() {
    return testFiles.map((file, index) => (
      <FileCard 
        key={index}
        fileName={file.fileName} 
        size={file.size} 
        link={file.link} 
      />
    ));
  }

  return (
    <View style={styles.container}>
      {renderFiles()}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between', // Changed from flex-start to space-between
      padding: 16, // Increased padding for better edge spacing
      gap: 16, // Increased gap for consistent spacing
    },
  });

export default FilesContainer;

const testFiles = [
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
    {
        fileName: 'fileName.txt',
        size: '20MB',
        link: 'test.ru'
    },
];