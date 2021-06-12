/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Animated, PanResponder } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { useShapeContext } from '../../state/shape';

const delay = 300;
const radius = 20;
let lastPress = 0;

const DOUBLE_PRESS_DELAY = 400;

export default function AnimatedShape({ children, style, shape, parentType }) {
  const { onDoubleTapShape, shapes } = useShapeContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [lastOffset, setLastOffset] = useState({
    offsetX: 0,
    offsetY: 0,
  });

  const [lastPosition, setLastPosition] = useState({
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    fadeIn();
  }, []);

  const pan = useRef(new Animated.ValueXY()).current;

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
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
        },
        // onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
        onPanResponderRelease: () => {
          pan.flattenOffset();
          const time = new Date().getTime();
          const delta = time - lastPress;

          if (delta < DOUBLE_PRESS_DELAY) {
            onDoubleTapShape({ id: shape.id, type: parentType });
          } else {
            lastPress = time;
          }
          return true;
        },
        // onShouldBlockNativeResponder: () => true,
      }),
    [shapes],
  );

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onHandlerStateChange = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onDoubleTapShape({ id: shape.id, type: parentType });
    }
  };

  return (
    // <TapGestureHandler
    //   numberOfTaps={2}
    //   onHandlerStateChange={onHandlerStateChange}>
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          opacity: fadeAnim,
          ...style,
        },
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}>
      {children}
    </Animated.View>
    // </TapGestureHandler>
  );
}
