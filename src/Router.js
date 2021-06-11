/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SquareScreen from './scenes/SquareScreen';
import CircleScreen from './scenes/CircleScreen';
import { ActivityIndicator, View } from 'react-native';
import { useShapeContext } from './state/shape';
import TriangleScreen from './scenes/TriangleScreen';
import AllShapesScreen from './scenes/AllShapesScreen';

const Tab = createBottomTabNavigator();

export default function Router() {
  const { waiting } = useShapeContext();
  if (waiting) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Square" component={SquareScreen} />
        <Tab.Screen name="Circle" component={CircleScreen} />
        <Tab.Screen name="Triangle" component={TriangleScreen} />
        <Tab.Screen name="All" component={AllShapesScreen} />
      </Tab.Navigator>
      {/* <View></View> */}
    </NavigationContainer>
  );
}
