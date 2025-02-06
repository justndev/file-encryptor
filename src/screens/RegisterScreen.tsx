import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Surface, TextInput } from 'react-native-paper';
import CustomIcon from '../components/CustomIcon';
import { icons } from '../utils/icons';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';


const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch()

  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRegister = async() => {
    if (validateEmail(email) && validatePassword()) {
      try {
        await auth().createUserWithEmailAndPassword(email, password);
        Alert.alert('Registration Successful');
        navigation.navigate('Login');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const EmailIcon = () => (
    <CustomIcon
      source={icons.mail}
      size={20}
    />
  );

  const PasswordIcon = () => (
    <CustomIcon
      source={icons.lock}
      size={20}
    />
  );

  const EyeIcon = ({ showPassword }) => (
    <CustomIcon
      source={showPassword ? icons.eyeSlash : icons.eye}
      size={20}
    />
  );

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (emailError) validateEmail(text);
          }}
          error={!!emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          left={<TextInput.Icon icon={() => <EmailIcon />} />}
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (passwordError) validatePassword();
          }}
          secureTextEntry={!showPassword}
          style={styles.input}
          left={<TextInput.Icon icon={() => <PasswordIcon />} />}
          right={
            <TextInput.Icon
              icon={() => <EyeIcon showPassword={showPassword} />}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <TextInput
          mode="outlined"
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            if (passwordError) validatePassword();
          }}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
          error={!!passwordError}
          left={<TextInput.Icon icon={() => <PasswordIcon />} />}
          right={
            <TextInput.Icon
              icon={() => <EyeIcon showPassword={showConfirmPassword} />}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
        />

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.registerButton}
          labelStyle={styles.buttonLabel}
          disabled={!email || !password || !confirmPassword}
        >
          Register
        </Button>

        <View style={styles.footer}>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
          >
            Already have an account? Sign in
          </Button>
        </View>
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
  },
  registerButton: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkButton: {
    marginTop: 8,
  }
});

export default RegisterScreen;