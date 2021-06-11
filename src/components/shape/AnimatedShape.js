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

export default function AnimatedShape({ children, style, shape, parentType }) {
  const { onDoubleTapShape } = useShapeContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [prevTouchInfo, setPrevTouchInfo] = useState({
    prevTouchX: 0,
    prevTouchY: 0,
    prevTouchTimeStamp: 0,
  });

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: evt => true,
        onPanResponderTerminationRequest: evt => true,
        onShouldBlockNativeResponder: evt => false,
        onPanResponderGrant: handlePanResponderGrant,
        onPanResponderMove: (e, gesture) => {
          console.log('move', {
            x: gesture.dx,
            y: gesture.dy,
          });
        },
        onPanResponderRelease: () => {},
      }),
    [],
  );

  useEffect(() => {
    fadeIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const distance = (x0, y0, x1, y1) => {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  };

  const isDoubleTap = (currentTouchTimeStamp, { x0, y0 }) => {
    const { prevTouchX, prevTouchY, prevTouchTimeStamp } = prevTouchInfo;
    const dt = currentTouchTimeStamp - prevTouchTimeStamp;

    return dt < delay && distance(prevTouchX, prevTouchY, x0, y0) < radius;
  };

  const handlePanResponderGrant = (evt, gestureState) => {
    // console.log('regrant');
    const currentTouchTimeStamp = Date.now();
    if (isDoubleTap(currentTouchTimeStamp, gestureState)) {
      console.log('double tap');
    }
    //   pan.setOffset({
    //     x: pan.x._value,
    //     y: pan.y._value,
    //   });
    // }
    setPrevTouchInfo({
      prevTouchX: gestureState.x0,
      prevTouchY: gestureState.y0,
      prevTouchTimeStamp: currentTouchTimeStamp,
    });
  };

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      // useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // console.log('position.getLayout()', position.getLayout());
  const onHandlerStateChange = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onDoubleTapShape({ id: shape.id, type: parentType });
    }
  };

  return (
    <TapGestureHandler
      numberOfTaps={2}
      onHandlerStateChange={onHandlerStateChange}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            opacity: fadeAnim,
            ...style,
          },
        ]}>
        {children}
      </Animated.View>
    </TapGestureHandler>
  );
}
