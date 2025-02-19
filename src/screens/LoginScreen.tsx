import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ButtonFabric from '../components/fabrics/ButtonFabric';
import CustomInputFabric from '../components/fabrics/TextInputFabric';
import { authController } from '../controllers/AuthorizationController';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    const { error } = authController.validateEmail(text);
    setEmailError(error);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const { error } = authController.validatePassword(text);
    setPasswordError(error);
  };

  const handleLogin = async () => {
    try {
      await authController.login(email, password);
      Alert.alert('Login Successful');
      navigation.navigate('MainApp');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
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
      <ButtonFabric
        type={1}
        label="Login"
        onPress={handleLogin}
        isDisabled={!email || !password || !!emailError || !!passwordError}
      />
      <ButtonFabric
        type={2}
        label="Don't have an account? Sign up"
        onPress={() => navigation.navigate('Register')}
      />
      <ButtonFabric
        type={2}
        label="Forgot Password?"
        onPress={() => navigation.navigate('ForgotPassword')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#1a1a1a",
  }
});

export default LoginScreen;
