import Animated, {
   useSharedValue,
   withSpring,
   useAnimatedStyle,
   useAnimatedGestureHandler,
   runOnJS,
   withTiming,
   interpolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { useState } from 'react';

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const WRAPPER_WIDTH = 524;
const WRAPPER_HEIGHT = WRAPPER_WIDTH / 2.5;
const KNOB_SIZE = WRAPPER_WIDTH / 3.75;

const initialState = 0;

const MicroInteraction = () => {
   const [count, setCount] = useState(initialState);
   const wrapperX = useSharedValue(0);
   const knobX = useSharedValue(0);
   const wrapperY = useSharedValue(0);
   const knobY = useSharedValue(0);
   const decrementContScale = useSharedValue(1);
   const incrementContScale = useSharedValue(1);
   const isVerticalGesture = useSharedValue(0);

   const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
         ctx.startX = wrapperX.value;
         ctx.startY = wrapperY.value;
         ctx.direction = undefined;
      },
      onActive: (event, ctx) => {
         if (ctx.direction === undefined) {
            ctx.direction = Math.abs(event.velocityX) > Math.abs(event.velocityY) ? 'x' : 'y';
         }
         if (ctx.direction === 'y') {
            isVerticalGesture.value = withTiming(1);
            wrapperY.value = interpolate(
               event.translationY,
               [0, WRAPPER_HEIGHT],
               [0, (WRAPPER_HEIGHT - KNOB_SIZE) / 3]
            );

            knobY.value = interpolate(
               event.translationY,
               [0, KNOB_SIZE],
               [0, (WRAPPER_HEIGHT - KNOB_SIZE) / 1.6]
            );
         } else {
            wrapperX.value = interpolate(
               event.translationX,
               [0, WRAPPER_WIDTH],
               [0, KNOB_SIZE / 2]
            );
            knobX.value = interpolate(event.translationX, [0, KNOB_SIZE], [0, KNOB_SIZE / 3]);
         }
         if (ctx.direction === 'x' && event.translationX >= 0) {
            incrementContScale.value = withTiming(1.2);
            decrementContScale.value = withTiming(1);
         } else if (ctx.direction === 'x' && event.translationX <= 0) {
            decrementContScale.value = withTiming(1.2);
            incrementContScale.value = withTiming(1);
         }
      },
      onEnd: (event, ctx) => {
         if (ctx.direction === 'x' && event.translationX >= 0) {
            runOnJS(setCount)(count + 1);
            incrementContScale.value = withTiming(1);
         } else if (ctx.direction === 'x' && event.translationX <= 0) {
            runOnJS(setCount)(count - 1);
            decrementContScale.value = withTiming(1);
         }

         if (ctx.direction === 'y') {
            wrapperY.value = withSpring(0);
            knobY.value = withSpring(0);
            isVerticalGesture.value = withTiming(0);
            runOnJS(setCount)(initialState);
         } else if (ctx.direction === 'x') {
            wrapperX.value = withSpring(0);
            knobX.value = withSpring(0);
         }
      },
   });

   const wrapperStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateX: wrapperX.value,
            },
            {
               translateY: wrapperY.value,
            },
         ],
      };
   });
   const knobStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateX: knobX.value,
            },
            {
               translateY: knobY.value,
            },
         ],
      };
   });

   const decrementStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateX: interpolate(isVerticalGesture.value, [0, 1], [0, 157]),
            },
            {
               rotate: `${interpolate(isVerticalGesture.value, [0, 1], [0, 314])}deg`,
            },
         ],
      };
   });

   const incrementStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateX: interpolate(isVerticalGesture.value, [0, 1], [0, -157]),
            },
            {
               rotate: `${interpolate(isVerticalGesture.value, [0, 1], [0, 224])}deg`,
            },
         ],
      };
   });
   const incrementStyle1 = useAnimatedStyle(() => {
      return {
         opacity: interpolate(isVerticalGesture.value, [0, 1], [1, 0]),
         transform: [
            {
               translateY: interpolate(isVerticalGesture.value, [0, 1], [0, 100]),
            },
         ],
      };
   });
   const decrementContStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               scale: interpolate(decrementContScale.value, [1, 0], [1, 0]),
            },
            {
               translateX: interpolate(decrementContScale.value, [0, 1], [KNOB_SIZE, 0]),
            },
         ],
      };
   });
   const incrementContStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               scale: interpolate(incrementContScale.value, [1, 0], [1, 0]),
            },
            {
               translateX: interpolate(incrementContScale.value, [0, 1], [-KNOB_SIZE, 0]),
            },
         ],
      };
   });

   return (
      <View style={styles.cont}>
         <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.wrapper, wrapperStyle]}>
               <View style={styles.actionButtonsContainer}>
                  <AnimatedButton
                     style={[styles.iconWrapper, decrementContStyle]}
                     onPress={() => setCount((count) => count - 1)}>
                     <Animated.View style={[styles.iconDec, decrementStyle]} />
                  </AnimatedButton>
                  <AnimatedButton
                     style={[styles.iconWrapper, incrementContStyle]}
                     onPress={() => setCount((count) => count + 1)}>
                     <Animated.View style={[styles.iconInc, incrementStyle]} />
                     <Animated.View style={[styles.iconDec2, incrementStyle1]} />
                  </AnimatedButton>
               </View>
               <Animated.View style={[styles.knob, knobStyle]}>
                  <Animated.Text style={[styles.text]}>{count}</Animated.Text>
               </Animated.View>
            </Animated.View>
         </PanGestureHandler>
      </View>
   );
};

const styles = StyleSheet.create({
   cont: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2C2C2C',
   },
   wrapper: {
      width: WRAPPER_WIDTH,
      height: WRAPPER_HEIGHT,
      borderRadius: 52,
      backgroundColor: '#448DFD',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   knob: {
      position: 'absolute',
      width: KNOB_SIZE,
      height: KNOB_SIZE,
      borderRadius: KNOB_SIZE * 2,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
   },
   knob1: {
      position: 'absolute',
   },
   actionButtonsContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   iconWrapper: {
      width: KNOB_SIZE,
      height: KNOB_SIZE,
      margin: (WRAPPER_HEIGHT - KNOB_SIZE) / 2,
      borderRadius: KNOB_SIZE * 2,
      alignItems: 'center',
      justifyContent: 'center',
   },

   iconDec: {
      width: 42,
      height: 4,
      borderRadius: 4,
      backgroundColor: '#051730',
   },
   iconInc: {
      width: 42,
      height: 4,
      borderRadius: 4,
      backgroundColor: '#051730',
   },
   iconDec2: {
      position: 'absolute',
      width: 4,
      height: 42,
      borderRadius: 4,
      backgroundColor: '#051730',
   },
   text: {
      color: '#051730',
      fontSize: 56,
      fontWeight: '500',
   },
   wrapperIcon: {
      width: WRAPPER_WIDTH,
      height: 220,
      zIndex: -10,
      position: 'absolute',
   },
});

export default MicroInteraction;
