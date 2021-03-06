import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatScreen from '../chatScreen';
import LoginScreen from '../phoneSignin';
import Connections from '../connections';
import CreateGroup from '../creatGroup';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="Connections" component={Connections} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
