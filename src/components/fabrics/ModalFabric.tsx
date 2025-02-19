import { View } from "react-native";
import CustomModal from "../CustomModal";
import FileCard from "../FileCard";
import { Button } from "react-native-paper";

interface ModalFabricProps {
    type: 'encrypt' | 'decrypt';
};

const ModalFabric = ({ type, onMainButtonPress, }: ModalFabricProps) => {
    switch (type) {
        case 'decrypt':
        return <CustomModal visible={!!selectedFile} onDismiss={() => setSelectedFile(null)}>
                {selectedFile && (
                    <>
                        <FileCard link={undefined} fileName={name} size={size} type={2} />
                        <View style={styles.modalButtonsContainer}>
                            <Button mode="contained" onPress={onMainButtonPress}>
                                Encrypt & Upload
                            </Button>
                        </View>
                    </>
                )}
            </CustomModal>
    }
    
};

export default ModalFabric;