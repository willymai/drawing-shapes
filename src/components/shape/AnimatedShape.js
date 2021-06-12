/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';
import { useShapeContext } from '../../state/shape';

let lastPress = 0;

const DOUBLE_PRESS_DELAY = 300;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const maxShapeSize = Math.round((screenWidth * 45) / 100);

const minShapeSize = Math.round((screenWidth * 10) / 100);

function calculateHypotenuse([point1, point2]) {
  const angleX = Math.abs(point1.pageX - point2.pageX);

  const angleY = Math.abs(point1.pageY - point2.pageY);

  const hypotenuse = Math.sqrt(angleX * angleX + angleY * angleY);

  return hypotenuse;
}

export default function AnimatedShape({ children, style, shape, parentType }) {
  const { onDoubleTapShape, shapes } = useShapeContext();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [position, setPosition] = useState({
    left: style.left,
    top: style.top,
  });

  const [scale, setScale] = useState(1);

  useEffect(() => {
    fadeIn();
  }, []);

  const isDragging = useRef(false);

  const hypotenuse = useRef(Math.sqrt(2 * shape.size * shape.size));

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
          return true;
        },
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          return true;
        },
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (e, gestureState) => {
          if (gestureState.numberActiveTouches === 2) {
            const newHypotenuse = calculateHypotenuse(e.nativeEvent.touches);
            hypotenuse.current = newHypotenuse;
          }

          const time = new Date().getTime();

          const delta = time - lastPress;

          if (delta < DOUBLE_PRESS_DELAY) {
            onDoubleTapShape({ id: shape.id, type: parentType });
            isDragging.current = false;
          } else {
            lastPress = time;
            isDragging.current = true;
          }
        },
        // onPanResponderMove: Animated.event([], {
        //   listener: (e, gestureState) => {
        //     console.log('number', gestureState.numberActiveTouches);
        //     setPosition({
        //       left: position.left + gestureState.dx,
        //       top: position.top + gestureState.dy,
        //     });
        //   },
        //   useNativeDriver: false,
        // }),
        onPanResponderMove: (e, gestureState) => {
          if (gestureState.numberActiveTouches === 2) {
            const newHypotenuse = calculateHypotenuse(e.nativeEvent.touches);

            let newScale = (newHypotenuse / hypotenuse.current) * scale;

            // check maxScale and minScale
            if (newScale * shape.size >= maxShapeSize) {
              newScale = maxShapeSize / shape.size;
            } else if (newScale * shape.size <= minShapeSize) {
              newScale = minShapeSize / shape.size;
            }

            setScale(newScale);
          } else if (gestureState.numberActiveTouches === 1) {
            const changeSize = (shape.size * (scale - 1)) / 2;

            let newLeft = position.left + gestureState.dx;

            let newTop = position.top + gestureState.dy;

            if (newLeft < changeSize) {
              newLeft = changeSize;
            } else if (newLeft + shape.size + changeSize >= screenWidth) {
              newLeft = screenWidth - shape.size - changeSize;
            }

            if (newTop < changeSize) {
              newTop = changeSize;
            } else if (newTop + shape.size + changeSize >= screenHeight) {
              newTop = screenHeight - shape.size - changeSize;
            }

            setPosition({
              left: newLeft,
              top: newTop,
            });
          }
        },
        onPanResponderRelease: (e, gesture) => {
          return true;
        },
        onShouldBlockNativeResponder: () => true,
      }),
    [shapes, position, scale],
  );

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          opacity: fadeAnim,
          ...style,
        },
        position,
        {
          transform: [
            {
              scaleX: scale,
            },
            {
              scaleY: scale,
            },
          ],
        },
      ]}>
      {children}
    </Animated.View>
  );
}
