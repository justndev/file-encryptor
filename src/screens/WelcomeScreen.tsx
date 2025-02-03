import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Button mode="contained" onPress={() => navigation.navigate('MainApp')} style={{width: '80%', maxWidth: 300, borderRadius: 8}}>
        <Text style={{fontSize: 18}}>
          Login
        </Text>
    </Button>
    <Button mode="contained" onPress={() => navigation.navigate('Register')} style={{width: '80%', maxWidth: 300, borderRadius: 8}}>
        <Text style={{fontSize: 18}}>
        Register
        </Text>
    </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default WelcomeScreen;