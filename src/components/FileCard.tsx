import { StyleSheet, View } from "react-native"
import CustomIcon from "./CustomIcon"
import { icons } from "../utils/icons"

const FileCard = ({filename = 'filename.txt', link, size = '228MB'}) => {
    return (
        <View>
            <CustomIcon source={icons.file} size={50}/>
            {filename}
            {size}
            
        </View>
    )
}

const styles = StyleSheet.create({

})

export default FileCard
