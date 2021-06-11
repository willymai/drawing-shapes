import 'react-native-gesture-handler';
import React from 'react';
import Router from './src/Router';
import { ShapeProvider } from './src/state/shape';

export default function App() {
  return (
    <ShapeProvider>
      <Router />
    </ShapeProvider>
  );
}
