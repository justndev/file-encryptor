import { StyleSheet, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { icons } from "../constants/icons";
import CustomIcon from "./CustomIcon";


interface ModalProps {
    visible: boolean;
    onDismiss: () => void;
    children: React.ReactNode;
}

const CustomModal = ({ visible, onDismiss, children }: ModalProps) =>
    <Portal>
        <Modal
            visible={visible}
            onDismiss={onDismiss}
            contentContainerStyle={containerStyle}
        >
           
            {children}
        </Modal>
    </Portal>

const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    alignSelf: 'center',
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 5,
};

const styles = StyleSheet.create({
    modalExitContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
});

export default CustomModal;
