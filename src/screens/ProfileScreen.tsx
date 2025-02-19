import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/fabrics/ButtonFabric';
import firebaseService from '../services/firebaseService';
import { useDispatch } from 'react-redux';


const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <CustomButton onPress={()=>firebaseService.logout(navigation, dispatch)} label={'Log out'} type={1}/>

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

export default ProfileScreen;
