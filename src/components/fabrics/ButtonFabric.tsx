import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

interface CustomButtonProps {
    onPress: () => void;
    label: string;
    type: number;
    isDisabled?: boolean;
}

const ButtonFabric: React.FC<CustomButtonProps> = ({ onPress, label, type, isDisabled }) => {
    if (type === 1) {
        return (
            <Button mode="contained" onPress={onPress} style={{ width: "80%", maxWidth: 300, borderRadius: 8, alignSelf: 'center' }}>
                <Text style={{ fontSize: 18 }}>{label}</Text>
            </Button>
        );
    }

    if (type === 2) {
        return (
            <View style={{ marginTop: 24, alignItems: 'center' }}>
                <Button mode="text" onPress={onPress} style={{ marginTop: 8 }}>
                    {label}
                </Button>
            </View>
        );
    }

    if (type === 3) {
        <Button
            mode="contained"
            onPress={onPress}
            style={styles.registerButton}
            labelStyle={styles.buttonLabel}
            disabled={isDisabled}
        >
            {label}
        </Button>
    }

    return null;
};

export default ButtonFabric;

const styles = StyleSheet.create({
    registerButton: {
        marginTop: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonLabel: {
        fontSize: 16,
        paddingVertical: 4,
    },
})
