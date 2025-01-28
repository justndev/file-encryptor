import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EncryptionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encryption Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
  },
});

export default EncryptionScreen;
