/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image } from 'react-native';
import AnimatedShape from './AnimatedShape';

export default function Square({ shape, parentType }) {
  const { size, x, y, bgColor, imageUrl } = shape;
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
        backgroundColor: bgColor,
      }}>
      <Image source={{ uri: imageUrl }} style={{ width: size, height: size }} />
    </AnimatedShape>
  );
}
