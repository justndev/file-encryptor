import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import FileCard from "./FileCard";


const FilesContainer = ({ userFiles }) => {
  const [files, setFiles] = useState(userFiles || []);

  useEffect(() => {
    setFiles(userFiles);
  }, [userFiles]);

  function renderFiles() {    
    return files.map((file, index) => (
      <FileCard 
        key={index}
        fileName={file.fileName} 
        fileSize={file.fileSize} 
        fileUrl={file.fileUrl} 
        fileId={file.fileId}
        iv={file.iv}
        salt={file.salt}
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
