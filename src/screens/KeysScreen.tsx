import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import {
  Text,
  Button,
  Menu,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import uuid from 'react-native-uuid';
import { encryptionUtils } from '../utils/encryptionUtils';
import AESKeyCard from '../components/AESKeyCard';
import CustomModal from '../components/CustomModal';

type KeyType = 'AES' | 'ChaCha20';

interface KeyItem {
  id: string;
  type: KeyType;
  content: string;
  createdDate: string;
}

const KeysScreen: React.FC = () => {
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedKeyType, setSelectedKeyType] = useState<KeyType>('AES');
  const [isAlgorithmMenuVisible, setIsAlgorithmMenuVisible] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const storedKeys = await AsyncStorage.getItem('encryption-keys');
      if (storedKeys) {
        setKeys(JSON.parse(storedKeys));
      }
    } catch (error) {
      console.error('Error loading keys', error);
    }
  };

  const saveKeys = async (updatedKeys: KeyItem[]) => {
    try {
      await AsyncStorage.setItem('encryption-keys', JSON.stringify(updatedKeys));
      setKeys(updatedKeys);
    } catch (error) {
      console.error('Error saving keys', error);
    }
  };


  // Add new key
  const addKey = async () => {
    const newKey: KeyItem = {
      id: uuid.v4().toString(),
      type: selectedKeyType,
      content: await encryptionUtils.generateBase64Key(),
      createdDate: new Date().toISOString()
    };

    const updatedKeys = [...keys, newKey];
    saveKeys(updatedKeys);
    setShowDialog(false);
  };

  const deleteKey = (id: string) => {
    Alert.alert(
      'Delete Key',
      'Are you sure you want to delete this key?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedKeys = keys.filter(key => key.id !== id);
            saveKeys(updatedKeys);
          }
        }
      ]
    );
  };

  const copyToClipboard = (key: string) => {
    Clipboard.setString(key);
    Alert.alert('Copied', 'Key has been copied to clipboard');
  };

  const renderKeyCard = (key: KeyItem) => {
    const formattedDate = new Date(key.createdDate).toLocaleString();
    return (
      <AESKeyCard keyContent={key.content} onCopy={() => copyToClipboard(key.content)}
        onDelete={() => deleteKey(key.id)} createdAt={formattedDate} />
    )
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Keys</Text>

      <Button
        mode="contained"
        onPress={() => setShowDialog(true)}
        style={styles.addButton}
      >
        Add New Key
      </Button>

      <CustomModal visible={showDialog} onDismiss={() => setShowDialog(false)} children={undefined}>
        <View style={styles.menuContainer}>
          <View style={styles.menuContainer}>
          <Text style={styles.title}>Create Key</Text>

            <Menu
              visible={isAlgorithmMenuVisible}
              onDismiss={() => setIsAlgorithmMenuVisible(false)}
              contentStyle={{
                marginTop: 50,  // Adjust this value to position the menu correctly
                width: Dimensions.get('window').width * 0.8 - 64 // Match the container width
              }}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsAlgorithmMenuVisible(true)}
                  style={{ borderRadius: 5 }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <Text>
                      {selectedKeyType}
                    </Text>
                    <Text>
                      {isAlgorithmMenuVisible ? '▼' : '▲'}
                    </Text>
                  </View>
                </Button>
              }
            >
              {['AES', 'ChaCha20'].map((algorithm) => (
                <Menu.Item
                  key={algorithm}
                  onPress={() => {
                    setSelectedKeyType(algorithm);
                    setIsAlgorithmMenuVisible(false);
                  }}
                  title={algorithm}
                />
              ))}
            </Menu>
          </View>
          <Button
          mode="contained"
          onPress={addKey}
          style={styles.generateButton}
        >
          Generate Key
        </Button>
        </View>
      </CustomModal>
     
      {keys.length === 0 ? (
        <Text style={styles.emptyState}>No keys generated yet</Text>
      ) : (
        keys.map(renderKeyCard)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FFF5FF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  keyCard: {
    marginBottom: 16,
  },
  keyText: {
    fontFamily: 'monospace',
  },
  menuContainer: {
    marginBottom: 16,
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  dialogCard: {
    width: '80%',
    padding: 16,
  },
  generateButton: {
    marginTop: 16,
  },
  emptyState: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 32,
  },
});

export default KeysScreen;
