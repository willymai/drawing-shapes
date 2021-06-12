/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import AnimatedShape from './AnimatedShape';

export default function Triangle({ shape, parentType }) {
  const { size, x, y, bgColor } = shape;

  return (
    <AnimatedShape
      shape={shape}
      parentType={parentType}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: size / 2,
        borderRightWidth: size / 2,
        borderBottomWidth: size,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: bgColor,
      }}
    />
  );
}
