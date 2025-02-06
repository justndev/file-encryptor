import { StyleSheet, View } from "react-native";
import FileCard from "./FileCard";
import { useEffect, useState } from "react";

const FilesContainer = ({ userFiles }) => {
  const [files, setFiles] = useState(userFiles || []);

  useEffect(() => {
    setFiles(userFiles);
  }, [userFiles]); // Следит за изменениями в userFiles

  function renderFiles() {    
    return files.map((file, index) => (
      <FileCard 
        key={index}
        fileName={file.fileName} 
        fileSize={file.fileSize} 
        fileUrl={file.fileUrl} 
        fileId={file.fileId}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {renderFiles()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
    gap: 16,
  },
});

export default FilesContainer;
