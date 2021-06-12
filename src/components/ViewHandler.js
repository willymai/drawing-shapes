/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from 'react';
import { PanResponder, View } from 'react-native';
import { useShapeContext } from '../state/shape';

export default function ViewHandler({ children, onTap }) {
  const { shapes } = useShapeContext();
  const handleTap = e => {
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    onTap({ x, y });
  };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: e => {
          console.log('onPanResponderRelease');
          handleTap(e);
        },
      }),
    [shapes],
  );

  return (
    <View
      // {...pan.panHandlers}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleTap}
      style={{
        flex: 1,
        flexGrow: 1,
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}>
      <View>{children}</View>
    </View>
  );
}
