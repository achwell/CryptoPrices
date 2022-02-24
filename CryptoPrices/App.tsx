import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DetailScreen, HomeScreen } from './screens';
import io from 'socket.io-client';

import { API_URL } from './consts/app-consts';

const Stack = createNativeStackNavigator();
export const socket = io(API_URL);

socket.on('connect', () => {
  console.log('socket is connected');
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
