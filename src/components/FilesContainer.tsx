import { StyleSheet, View } from "react-native";
import FileCard from "./FileCard";

const FilesContainer = ({files}) => {

    function renderFiles() {
        return files.map((file) =>
            <FileCard filename={file.filename} size={file.size} link={file.link} />
        )
    }

    return (
        <View>
            {renderFiles()}
        </View>
    )
};

export default FilesContainer;

const styles = StyleSheet.create({

});