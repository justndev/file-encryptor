// FileCard.js
import { StyleSheet, Text, View } from "react-native";
import CustomIcon from "./CustomIcon";
import { icons } from "../utils/icons";

const FileCard = ({ fileName, link, size, type }) => {
  return (
    <View style={[styles.card, type == 1 && styles.whiteField]}>
      <CustomIcon source={icons.file} size={100} />
      <Text style={styles.fileName}>
        {fileName}
      </Text>
      <Text style={styles.fileSize}>
        {size}
      </Text>
    </View>
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