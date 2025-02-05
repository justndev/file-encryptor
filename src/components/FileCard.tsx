// FileCard.js
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import CustomIcon from "./CustomIcon";
import { icons } from "../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedFileToDownload } from "../redux/appSlice";
import FirebaseService from "../services/FirebaseService";
import FileService from "../services/FileService";

const FileCard = ({ fileName, fileUrl, fileSize, type, onPress}) => {
  const dispatch = useDispatch()
  const selectedFileToDownload = useSelector((state) => state.app.selectedFileToDownload)

  function handlePress() {
    const file = { fileName, fileUrl, fileSize, type}
    dispatch(setSelectedFileToDownload({file}))
  }



  return (
    <TouchableWithoutFeedback onPress={handlePress}>
    <View style={[styles.card, type == 1 && styles.whiteField]}>
      <CustomIcon source={icons.file} size={100} onPress={handlePress}/>
      <Text style={styles.fileName}>
        {fileName}
      </Text>
      <Text style={styles.fileSize}>
        {fileSize}
      </Text>
    </View>
    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  card: {
    width: '30%', // Slightly less than 33.33% to account for gap
    alignItems: 'center',
    padding: 10,
  },
  whiteField: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fileName: {
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  fileSize: {
    textAlign: 'center',
  }
});

export default FileCard;