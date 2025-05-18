import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import {
  Button,
  ProgressBar,
  Surface,
  TextInput
} from 'react-native-paper';
import RNFS from 'react-native-fs';
import Clipboard from '@react-native-clipboard/clipboard';
import { appService } from '../services/appService';
import { encryptionUtils } from "../utils/encryptionUtils";

const TestScreen = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [logs, setLogs] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentOperation, setCurrentOperation] = useState('');
  const [fileSizeMB, setFileSizeMB] = useState('50');
  const [testFilePath, setTestFilePath] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const scrollViewRef = useRef(null);

  const appendLog = (message) => {
    setLogs((prevLogs) => prevLogs + message + '\n');
  };

  const getCurrentTimeFormatted = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };

  const createTestFile = async (sizeMB) => {
    try {
      setCurrentOperation("Creating test file...");
      appendLog(`Creating ${sizeMB}MB test file...`);
      
      const testFileName = `test_file_${Date.now()}.txt`;
      const testFilePath = `${RNFS.ExternalDirectoryPath}/${testFileName}`;
      
      // Create data
      const chunkSize = 1024 * 1024; // 1MB
      const chunk = Array(chunkSize).fill('A').join('');
      
      // Write initial file
      await RNFS.writeFile(testFilePath, '', 'utf8');
      
      // Append data in chunks to avoid memory issues
      for (let i = 0; i < sizeMB; i++) {
        await RNFS.appendFile(testFilePath, chunk, 'utf8');
        setProgress((i + 1) / sizeMB * 0.1); // First 10% of progress for file creation
      }
      
      const fileStats = await RNFS.stat(testFilePath);
      appendLog(`Test file created at: ${testFilePath}`);
      appendLog(`File size: ${(fileStats.size / (1024 * 1024)).toFixed(2)} MB`);
      appendLog('');
      
      return {
        uri: testFilePath,
        name: testFileName,
        size: fileStats.size
      };
    } catch (error) {
      appendLog(`ERROR creating test file: ${error.message}`);
      throw error;
    }
  };

  const generateEncryptionKey = async () => {
    try {
      appendLog("Generating encryption key...");
      const key = await encryptionUtils.generateBase64Key();
      appendLog("Key generated successfully");
      appendLog('');
      return key;
    } catch (error) {
      appendLog(`ERROR generating key: ${error.message}`);
      throw error;
    }
  };

  const performAESTest = async (testFile, key, cycles = 5) => {
    try {
      appendLog("===== AES TESTS =====");
      let totalEncryptTime = 0;
      let totalDecryptTime = 0;
      
      for (let i = 1; i <= cycles; i++) {
        appendLog(`\nCycle ${i}/${cycles}:`);
        setCurrentOperation(`AES Test: Cycle ${i}/${cycles} - Encrypting`);
        
        // Set progress - each cycle is (90% / cycles) of progress (after 10% for file creation)
        const cycleProgressStart = 0.1 + ((i - 1) / cycles * 0.9);
        const cycleProgressMiddle = 0.1 + ((i - 0.5) / cycles * 0.9);
        const cycleProgressEnd = 0.1 + (i / cycles * 0.9);
        
        setProgress(cycleProgressStart);
        
        // Encrypt
        const encryptStartTime = Date.now();
        appendLog(`Encrypting file...`);
        
        let encryptedFilePath;
        try {
          encryptedFilePath = await appService.encryptFileAesCbc(testFile, key);
          const encryptTime = Date.now() - encryptStartTime;
          totalEncryptTime += encryptTime;
          appendLog(`Encryption time: ${encryptTime} ms`);
        } catch (error) {
          appendLog(`ERROR during encryption: ${error.message}`);
          continue;
        }
        
        setProgress(cycleProgressMiddle);
        setCurrentOperation(`AES Test: Cycle ${i}/${cycles} - Decrypting`);
        
        // Decrypt
        const decryptStartTime = Date.now();
        appendLog(`Decrypting file...`);
        
        let decryptedFilePath;
        try {
          const encryptedFile = {
            uri: encryptedFilePath,
            name: encryptedFilePath.split('/').pop()
          };
          
          decryptedFilePath = await appService.decryptFileAesCbc(encryptedFile, key);
          const decryptTime = Date.now() - decryptStartTime;
          totalDecryptTime += decryptTime;
          appendLog(`Decryption time: ${decryptTime} ms`);
        } catch (error) {
          appendLog(`ERROR during decryption: ${error.message}`);
          
          // Clean up encrypted file even if decryption failed
          if (encryptedFilePath) {
            try {
              await RNFS.unlink(encryptedFilePath);
            } catch (cleanupError) {
              appendLog(`ERROR cleaning up encrypted file: ${cleanupError.message}`);
            }
          }
          
          continue;
        }
        
        // Clean up files
        appendLog(`Cleaning up test files...`);
        try {
          if (encryptedFilePath) await RNFS.unlink(encryptedFilePath);
          if (decryptedFilePath) await RNFS.unlink(decryptedFilePath);
        } catch (error) {
          appendLog(`ERROR cleaning up files: ${error.message}`);
        }
        
        setProgress(cycleProgressEnd);
      }
      
      // Calculate averages
      appendLog("\nAES Test Summary:");
      appendLog(`Total cycles completed: ${cycles}`);
      appendLog(`Average encryption time: ${Math.round(totalEncryptTime / cycles)} ms`);
      appendLog(`Average decryption time: ${Math.round(totalDecryptTime / cycles)} ms`);
      appendLog(`Average cycle time: ${Math.round((totalEncryptTime + totalDecryptTime) / cycles)} ms`);
      appendLog("");
      
    } catch (error) {
      appendLog(`ERROR in AES test: ${error.message}`);
      throw error;
    }
  };
  
  const cleanupTestFiles = async (testFile) => {
    try {
      appendLog("Cleaning up original test file...");
      await RNFS.unlink(testFile.uri);
      appendLog("Cleanup completed");
    } catch (error) {
      appendLog(`ERROR during cleanup: ${error.message}`);
    }
  };

  const handleStartTest = async () => {
    try {
      setIsTesting(true);
      setLogs('');
      setProgress(0);
      setCurrentOperation('Initializing test...');
      
      appendLog("===== AES ENCRYPTION/DECRYPTION TEST =====");
      appendLog(`Started at: ${getCurrentTimeFormatted()}`);
      appendLog("");
      
      // Create test file
      const testFile = await createTestFile(parseInt(fileSizeMB, 10) || 50);
      setTestFilePath(testFile.uri);
      
      // Generate encryption key
      const key = await generateEncryptionKey();
      setEncryptionKey(key);
      
      // Perform AES test
      await performAESTest(testFile, key, 5);
      
      // Clean up
      await cleanupTestFiles(testFile);
      
      appendLog(`Test completed at: ${getCurrentTimeFormatted()}`);
      setProgress(1);
      setCurrentOperation('Test completed');
    } catch (error) {
      appendLog(`CRITICAL ERROR: ${error.message}`);
      appendLog(`Stack trace: ${error.stack}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearLogs = () => {
    setLogs('');
  };

  const handleCopyLogs = () => {
    Clipboard.setString(logs);
    Alert.alert(
      'Success',
      'Logs copied to clipboard',
      [{ text: 'OK' }]
    );
  };

  const handleSaveResults = async () => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `aes_test_${timestamp}.txt`;
      const filePath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
      
      await RNFS.writeFile(filePath, logs, 'utf8');
      
      Alert.alert(
        'Success',
        `Results saved to ${filePath}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to save results: ${error.message}`,
        [{ text: 'OK' }]
      );
    }
  };

  // Request permissions on component mount if needed
  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          // Check if directory exists, create if not
          const dirExists = await RNFS.exists(RNFS.ExternalDirectoryPath);
          if (!dirExists) {
            await RNFS.mkdir(RNFS.ExternalDirectoryPath);
          }
        } catch (error) {
          console.error('Error setting up directory:', error);
        }
      }
    };
    
    checkAndRequestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AES Encryption Test Suite</Text>

      {/* Test configuration */}
      <Surface style={styles.configContainer}>
        <Text style={styles.sectionTitle}>Test Configuration</Text>
        <TextInput
          label="Test File Size (MB)"
          value={fileSizeMB}
          onChangeText={setFileSizeMB}
          keyboardType="numeric"
          disabled={isTesting}
          style={styles.input}
          mode="outlined"
        />
      </Surface>

      {/* Test control buttons */}
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={handleStartTest}
          disabled={isTesting}
          style={styles.button}
        >
          Start Testing
        </Button>

        <Button
          mode="contained"
          onPress={handleClearLogs}
          disabled={logs.length === 0 || isTesting}
          style={styles.button}
        >
          Clear Logs
        </Button>
      </View>

      {/* Progress indicator */}
      {isTesting ? (
        <View style={styles.progressContainer}>
          <Text style={styles.operationText}>{currentOperation}</Text>
          <ProgressBar progress={progress} style={styles.progressBar} />
        </View>
      ) : (
        <View style={styles.spacer} />
      )}

      {/* Logs display */}
      <Surface style={styles.logsContainer}>
        <ScrollView 
          style={styles.scrollView}
          ref={scrollViewRef} // Use the ref here
          onContentSizeChange={() => {
            scrollViewRef.current && scrollViewRef.current.scrollToEnd({animated: true});
          }}
        >
          <Text style={styles.logText}>
            {logs.length > 0
              ? logs
              : 'Logs will appear here once testing starts...'}
          </Text>
        </ScrollView>
      </Surface>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={handleCopyLogs}
          disabled={logs.length === 0}
          style={styles.button}
        >
          Copy Logs
        </Button>

        <Button
          mode="contained"
          onPress={handleSaveResults}
          disabled={logs.length === 0}
          style={styles.button}
        >
          Save Results
        </Button>
      </View>

      {/* Debug info (optional) */}
      {(testFilePath && encryptionKey) && (
        <Surface style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Info</Text>
          {testFilePath && (
            <Text style={styles.debugText}>Test file: {testFilePath}</Text>
          )}
          {encryptionKey && typeof encryptionKey === 'string' && (
  <Text style={styles.debugText}>Key: {encryptionKey.substring(0, 10)}...</Text>
)}
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  configContainer: {
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  progressContainer: {
    marginVertical: 16,
  },
  operationText: {
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  spacer: {
    height: 16,
  },
  logsContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  debugContainer: {
    padding: 8,
    marginTop: 8,
    elevation: 1,
    borderRadius: 4,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default TestScreen;