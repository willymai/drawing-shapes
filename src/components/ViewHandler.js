/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';

export default function ViewHandler({ children, onTap }) {
  const handleTap = e => {
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    onTap({ x, y });
  };

  return (
    <View
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleTap}
      style={{
        flex: 1,
        position: 'relative',
      }}>
      {children}
    </View>
  );
}
