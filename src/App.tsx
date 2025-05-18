import React from 'react';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './screens/WelcomeScreen';
import EncryptionScreen from './screens/EncryptionScreen';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import CustomIcon from './components/CustomIcon';
import { icons } from './constants/icons';
import DecryptScreen from './screens/DecryptScreen';
import KeysScreen from './screens/KeysScreen';
import TestScreen from './screens/TestScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Decrypt"
        component={DecryptScreen}
        options={{
          tabBarLabel: 'Decrypt',
          tabBarIcon: ({ color, size }) => {
            return <CustomIcon source={icons.lockClosed} size={size}/>;
          },
        }}
      />
      <Tab.Screen
        name="Encrypt"
        component={EncryptionScreen}
        options={{
          tabBarLabel: 'Encrypt',
          tabBarIcon: ({ color, size }) => {
            return <CustomIcon source={icons.lockOpened} size={size}/>;
          },
        }}
      />
        <Tab.Screen
        name="Keys"
        component={KeysScreen}
        options={{
          tabBarLabel: 'Keys',
          tabBarIcon: ({ color, size }) => {
            return <CustomIcon source={icons.key} size={size}/>;
          },
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{
          tabBarLabel: 'Test',
          tabBarIcon: ({ color, size }) => {
            return <CustomIcon source={icons.test} size={size}/>;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator initialRouteName={'Welcome'}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainApp"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;