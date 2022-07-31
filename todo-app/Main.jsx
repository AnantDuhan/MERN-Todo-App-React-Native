import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Footer from './Components/Footer';
import Loader from './Components/Loader';

import Home from './Screens/Home';
import Login from './Screens/Login';
import Profile from './Screens/Profile';
import Register from './Screens/Register';
import Camera from './Screens/Camera';
import Verify from './Screens/Verify';
import ResetPassword from './Screens/ResetPassword';
import ForgetPassword from './Screens/ForgetPassword';
import ChangePassword from './Screens/ChangePassword';

import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/actions';

const Stack = createNativeStackNavigator();

const Main = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    const { isAuthenticated, loading } = useSelector((state) => state.auth);

  return loading ? (
      <Loader />
  ) : (
      <NavigationContainer>
          <Stack.Navigator
              initialRouteName={isAuthenticated ? 'home' : 'login'}
          >
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
                  name="verify"
                  component={Verify}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="camera"
                  component={Camera}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="profile"
                  component={Profile}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="changepassword"
                  component={ChangePassword}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="forgetpassword"
                  component={ForgetPassword}
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="resetpassword"
                  component={ResetPassword}
                  options={{ headerShown: false }}
              />
          </Stack.Navigator>
          {isAuthenticated && <Footer />}
      </NavigationContainer>
  );
}

export default Main