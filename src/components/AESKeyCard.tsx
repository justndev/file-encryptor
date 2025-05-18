import { StyleSheet, Text, View } from "react-native"
import CustomIcon from "./CustomIcon";
import { icons } from "../constants/icons";
import { useEffect } from "react";

interface AESKeyCardProps {
    onCopy: () => void;
    onDelete: () => void;
    keyContent: string;
    createdAt: string;
}
const MAX_KEY_LENGTH = 20

const AESKeyCard = ({onCopy, onDelete, keyContent, createdAt}: AESKeyCardProps) => {

    return (
        <View style={styles.cardContainer}>
            <View style={styles.row}>
                <View style={styles.keyWidgetContainer}>
                    <View style={styles.keyWidgetRound}>
                        <Text style={styles.keyWidgetRoundInnerText}>AES</Text>
                    </View>
                    <View style={styles.keyWidgetTextField}>
                        <Text style={styles.keyWidgetTextHeader}>Shared Key</Text>
                        <Text style={styles.keyWidgetTextContent}>
                        {keyContent.length > MAX_KEY_LENGTH ? keyContent.substring(0, MAX_KEY_LENGTH) + "..." : keyContent}
                            </Text>
                    </View>
                </View>
                <CustomIcon source={icons.copy} onPress={onCopy}/>
            </View>

            <View style={styles.row}>
                <CustomIcon source={icons.bin} onPress={onDelete} color="red"/>
                <Text>{createdAt}</Text>
            </View>
        </View>
    )
}

export default AESKeyCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        backgroundColor: '#E7DEE8',
        justifyContent: 'space-between',
        flexDirection: 'column',
        borderRadius: 13,
        padding: 10,
        gap: 15,
        marginTop: 20
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    keyWidgetContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    keyWidgetRound: {
        backgroundColor: '#CBCACD',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 20,
        padding: 5,
    },
    keyWidgetTextField: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    },
    keyWidgetTextHeader: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    keyWidgetTextContent: {
        fontSize: 20,
        flexShrink: 1,
    },
    keyWidgetRoundInnerText: {
        fontSize: 20,
        fontWeight: 'bold'
    }

})