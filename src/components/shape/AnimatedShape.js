/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Animated, PanResponder } from 'react-native';
import { useShapeContext } from '../../state/shape';

let lastPress = 0;

const DOUBLE_PRESS_DELAY = 300;

export default function AnimatedShape({ children, style, shape, parentType }) {
  const { onDoubleTapShape, shapes } = useShapeContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [position, setPosition] = useState({
    left: style.left,
    top: style.top,
  });

  useEffect(() => {
    fadeIn();
  }, []);

  const isDragging = useRef(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
          return true;
        },
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (e, gestureState) => {
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
        // onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
        onPanResponderMove: Animated.event([], {
          listener: (e, gestureState) => {
            setPosition({
              left: position.left + gestureState.dx,
              top: position.top + gestureState.dy,
            });
          },
          useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gesture) => {
          console.log('release');

          return true;
        },
        // onShouldBlockNativeResponder: () => true,
      }),
    [shapes, position],
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
      ]}>
      {children}
    </Animated.View>
  );
}
