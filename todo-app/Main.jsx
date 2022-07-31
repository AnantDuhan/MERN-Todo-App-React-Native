import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Screens/Home';
import Login from './Screens/Login';
import Footer from './Components/Footer';
import Profile from './Screens/Profile';
import Register from './Screens/Register';
import Camera from './Screens/Camera';

const Stack = createNativeStackNavigator();

const Main = () => {
  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="login">
              <Stack.Screen
                  name="home"
                  component={Home}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="login"
                  component={Login}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="register"
                  component={Register}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="profile"
                  component={Profile}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="camera"
                  component={Camera}
                  options={{ headerShown: false }}
              />
          </Stack.Navigator>
          <Footer />
      </NavigationContainer>
  );
}

export default Main