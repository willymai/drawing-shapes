import { Dimensions } from 'react-native';
import ShapeTypes from '../common/ShapeTypes';

const { width } = Dimensions.get('window');

const maxShapeSize = Math.round((width * 45) / 100);

const minShapeSize = Math.round((width * 10) / 100);

export function getShapeSize({ x, y }) {
  let newX = x;
  let newY = y;
  const size = Math.floor(
    Math.random() * (maxShapeSize - minShapeSize) + minShapeSize,
  );
  if (x < size / 2) {
    newX = size / 2 + 10;
  }
  if (x + size > width) {
    newX = width - size / 2 - 10;
  }

  return {
    x: newX,
    y: newY,
    size,
  };
}

export function randomShape() {
  const number = randomNumer(3);
  switch (number) {
    case 1:
      return ShapeTypes.Square;
    case 2:
      return ShapeTypes.Circle;
    default:
      return ShapeTypes.Triangle;
  }
}

export function randomNumer(num) {
  return Math.floor(Math.random() * num) + 1;
}

export function randomHexColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}
