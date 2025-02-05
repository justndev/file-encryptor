import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Surface, TextInput } from 'react-native-paper';
import CustomIcon from '../components/CustomIcon';
import { icons } from '../utils/icons';
import auth from '@react-native-firebase/auth';
import store from '../redux/store';
import { setUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('n@n.com');
  const [password, setPassword] = useState('Nnnnnn');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const dispatch = useDispatch();

  const validateEmail = (email) => {
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

  const handleLogin = async () => {
    if (validateEmail(email) && password) {
      try {
        const credentials = await auth().signInWithEmailAndPassword(email, password);
        dispatch(
          setUser({
            userId: credentials.user.uid
          })
        );

        Alert.alert('Login Successful');
        navigation.navigate('MainApp');
  
      } catch (error) {
        Alert.alert('Error', error.message);
      };
    };
  };

  // Custom left and right components for TextInput
  const EmailIcon = () => 
    <CustomIcon
      source={icons.mail} // You'll need to add your icon
      size={20}
    />

  const PasswordIcon = () => 
    <CustomIcon
      source={icons.lock} // You'll need to add your icon
      size={20}
    />
  

  const EyeIcon = () => 
    <CustomIcon
      source={showPassword ? 
        icons.eyeSlash : 
        icons.eye}
      size={20}
    />
  

  return (
    <Surface style={styles.surface}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        
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
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          left={<TextInput.Icon icon={() => <PasswordIcon />} />}
          right={
            <TextInput.Icon 
              icon={() => <EyeIcon />}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.loginButton}
          labelStyle={styles.buttonLabel}
          disabled={!email || !password}
        >
          Login
        </Button>
        
        <View style={styles.footer}>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.linkButton}
          >
            Don't have an account? Sign up
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.linkButton}
          >
            Forgot Password?
          </Button>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
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
  loginButton: {
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

export default LoginScreen;