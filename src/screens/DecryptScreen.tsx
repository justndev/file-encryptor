import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { 
  Text, 
  Button, 
  Menu, 
  ProgressBar,
  MD3Colors, 
  TextInput
} from 'react-native-paper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { appService } from '../services/appService';
import { fileController } from '../controllers/FileController';

const DecryptScreen: React.FC = () => {
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

      setSelectedFile(result);
      setOutputFilePath(null);
      setErrorMessage(null);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        setErrorMessage('Error selecting file');
      }
    }
  };

  const handleDecrypt = async () => {
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

      const decryptedFilePath = await appService.decryptFileAesCbc(selectedFile, keyInput)
      setOutputFilePath(decryptedFilePath);
    } catch (error) {
      setErrorMessage(`Decryption error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Decrypt File</Text>

      {/* Algorithm Selection */}
      <View style={styles.menuContainer}>
        <Menu
          visible={isAlgorithmMenuVisible}
          onDismiss={() => setIsAlgorithmMenuVisible(false)}
          contentStyle={{
            marginTop: 50,  // Adjust this value to position the menu correctly
            marginLeft: 16, // Align with the container padding
            width: Dimensions.get('window').width - 32 // Match the container width
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

      {/* File Selection Button */}
      <Button 
        mode="contained" 
        onPress={handleFilePick}
        style={styles.button}
      >
        Select File to Decrypt
      </Button>

      {/* Selected File Card */}
      {selectedFile && (
        <View style={styles.card}>
          <Text style={{fontWeight: 'bold'}}>Selected File:</Text>
          <Text>{selectedFile.name}</Text>
        </View>
      )}

      {/* Key Input */}
      <View style={styles.inputContainer}>
        <TextInput 
          label={`Paste ${selectedAlgorithm} Key (Base64)`}
          value={keyInput}
          mode={'outlined'}
          onChangeText={setKeyInput}
          style={{height: 70}}
        />
      </View>

      {/* Decrypt Button */}
      <Button 
        mode="contained" 
        onPress={handleDecrypt}
        disabled={isProcessing || !selectedFile}
        style={styles.button}
      >
        {isProcessing ? 'Decrypting...' : 'Decrypt File'}
      </Button>

      {/* Progress Indicator */}
      {isProcessing && (
        <ProgressBar 
          progress={0.5} 
          color={MD3Colors.primary50} 
          style={styles.progressBar} 
        />
      )}

      {/* Error Message */}
      {errorMessage && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Output File Path */}
      {outputFilePath && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>File decrypted successfully!</Text>
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

export default DecryptScreen;