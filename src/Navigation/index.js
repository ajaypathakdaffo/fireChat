import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatScreen from '../chatScreen';
import LoginScreen from '../phoneSignin';
import Connections from '../connections';

const Stack = createStackNavigator();
a = 100;
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Connections" component={Connections} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
