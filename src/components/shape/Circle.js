/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import AnimatedShape from './AnimatedShape';

export default function Circle({ shape, parentType }) {
  const { size, x, y, bgColor } = shape;
  return (
    <AnimatedShape
      shape={shape}
      parentType={parentType}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
      }}
    />
  );
}
