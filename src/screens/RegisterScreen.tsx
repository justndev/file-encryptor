import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ButtonFabric from '../components/fabrics/ButtonFabric';
import CustomInputFabric from '../components/fabrics/TextInputFabric';
import { authController } from '../controllers/AuthorizationController';


const RegisterScreen = ({ navigation } : {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    const { error } = authController.validateEmail(text);
    setEmailError(error);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const { error } = authController.validatePassword(text, confirmPassword);
    setPasswordError(error);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    const { error } = authController.validatePassword(password, text);
    setPasswordError(error);
  };

  const handleRegister = async () => {
    try {
      await authController.register(email, password, confirmPassword);
      Alert.alert('Registration Successful');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const isFormValid = () => {
    return (
      email && 
      password && 
      confirmPassword && 
      !emailError && 
      !passwordError
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <CustomInputFabric
        type="email"
        value={email}
        onChangeText={handleEmailChange}
        error={emailError}
      />

      <CustomInputFabric
        type="password"
        value={password}
        onChangeText={handlePasswordChange}
        error={passwordError}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
      />

      <CustomInputFabric
        type="confirmPassword"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        error={passwordError}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <ButtonFabric 
        type={1} 
        label="Register" 
        onPress={handleRegister} 
        isDisabled={!isFormValid()} 
      />

      <ButtonFabric 
        type={2} 
        label="Already have an account? Sign in" 
        onPress={() => navigation.navigate('Login')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 16,
    marginTop: -8,
    fontSize: 12,
    paddingLeft: 12,
  }
});

export default RegisterScreen;