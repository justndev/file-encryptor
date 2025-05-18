import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Alert,
  Platform
} from 'react-native';
import { 
  Text, 
  Button, 
  Menu, 
  ProgressBar,
  MD3Colors, 
  TextInput
} from 'react-native-paper';
import { appService } from '../services/appService';
import permissionRequests from '../utils/permissionRequests';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { fileController } from '../controllers/FileController';



const EncryptScreen: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFilePath, setOutputFilePath] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('AES');
  const [isAlgorithmMenuVisible, setIsAlgorithmMenuVisible] = useState(false);

  const handleFilePick = async () => {
    try {
      const result = await fileController.pickDocument();
      if (result) {
        setSelectedFile(result);
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const handleEncrypt = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file first');
      return;
    }

    if (!keyInput.trim()) {
      setErrorMessage(`Please enter a ${selectedAlgorithm} key`);
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setOutputFilePath(null);

      const endFileUrl = await appService.encryptFileAesCbc(selectedFile, keyInput)
      console.log(endFileUrl)
      setOutputFilePath(endFileUrl);


    } catch (error) {
      setErrorMessage(`Encryption error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Encrypt File</Text>

      <View style={styles.menuContainer}>
        <Menu
          visible={isAlgorithmMenuVisible}
          onDismiss={() => setIsAlgorithmMenuVisible(false)}
          contentStyle={{
            marginTop: 50,
            marginLeft: 16,
            width: Dimensions.get('window').width - 32
          }}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setIsAlgorithmMenuVisible(true)}
              style={{borderRadius: 5}}
            >
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <Text>
                  {selectedAlgorithm} 
                </Text>
                <Text>
                   {isAlgorithmMenuVisible ? '▼' : '▲'}
                </Text>
              </View>
            </Button>
          }
        >
          {['AES', 'ChaCha20'].map(algorithm => (
            <Menu.Item 
              key={algorithm}
              onPress={() => {
                setSelectedAlgorithm(algorithm);
                setIsAlgorithmMenuVisible(false);
              }} 
              title={algorithm} 
            />
          ))}
        </Menu>
      </View>

      <Button 
        mode="contained" 
        onPress={handleFilePick}
        style={styles.button}
      >
        Select File to Encrypt
      </Button>

      {selectedFile && (
        <View style={styles.card}>
          <Text style={{fontWeight: 'bold'}}>Selected File:</Text>
          <Text>{selectedFile.name}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput 
          label={`Paste ${selectedAlgorithm} Key (Base64)`}
          value={keyInput}
          mode={'outlined'}
          onChangeText={setKeyInput}
          style={{height: 70}}
        />
      </View>

      <Button 
        mode="contained" 
        onPress={handleEncrypt}
        disabled={isProcessing || !selectedFile}
        style={styles.button}
      >
        {isProcessing ? 'Encrypting...' : 'Encrypt File'}
      </Button>

      {isProcessing && (
        <ProgressBar 
          progress={0.5} 
          color={MD3Colors.primary50} 
          style={styles.progressBar} 
        />
      )}

      {errorMessage && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {outputFilePath && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>File encrypted successfully!</Text>
          <Text style={styles.successPath}>Saved to: {outputFilePath}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  menuContainer: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    marginBottom: 16,
    padding: 16,
    borderRadius: 13,
    backgroundColor: '#CCCCCC',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
    
  },
  keyInputCard: {
    height: 120,
    marginTop: 8,
  },
  keyInput: {
    height: '100%',
  },
  progressBar: {
    width: '100%',
    marginBottom: 16,
  },
  errorCard: {
    width: '100%',
    backgroundColor: '#FFEBEE',
    marginBottom: 16,
    padding: 16,
  },
  errorText: {
    color: '#D32F2F',
  },
  successCard: {
    width: '100%',
    backgroundColor: '#E8F5E9',
    padding: 16,
  },
  successTitle: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  successPath: {
    color: '#2E7D32',
  },
});

export default EncryptScreen;