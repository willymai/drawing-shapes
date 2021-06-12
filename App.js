import 'react-native-gesture-handler';
import React from 'react';
import Router from './src/Router';
import { ShapeProvider } from './src/state/shape';

import Ionicons from 'react-native-vector-icons/Ionicons';

Ionicons.loadFont();

export default function App() {
  return (
    <ShapeProvider>
      <Router />
    </ShapeProvider>
  );
}
