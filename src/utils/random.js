import { Dimensions } from 'react-native';
import ShapeTypes from '../common/ShapeTypes';

const { width } = Dimensions.get('window');

const maxShapeSize = Math.round((width * 45) / 100);

const minShapeSize = Math.round((width * 10) / 100);

export function randomeSize({ x, y }) {
  return Math.floor(
    Math.random() * (maxShapeSize - minShapeSize) + minShapeSize,
  );
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
