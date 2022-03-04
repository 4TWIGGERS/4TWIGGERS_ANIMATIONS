import { StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withTiming,
   withDelay,
   interpolate,
   withRepeat,
} from 'react-native-reanimated';
import { DSS } from 'styles';

const AnimationSwitcher = () => {
   const circle1 = useSharedValue(1);
   const circle2 = useSharedValue(1);
   const circle3 = useSharedValue(1);

   const circle1_style = useAnimatedStyle(() => {
      return {
         transform: [
            {
               scale: interpolate(circle1.value, [1, 0], [1, 0]),
            },
         ],
      };
   });
   const circle2_style = useAnimatedStyle(() => {
      return {
         transform: [
            {
               scale: interpolate(circle2.value, [1, 0], [1, 0]),
            },
         ],
      };
   });
   const circle3_style = useAnimatedStyle(() => {
      return {
         transform: [
            {
               scale: interpolate(circle3.value, [1, 0], [1, 0]),
            },
         ],
      };
   });

   circle1.value = withRepeat(withTiming(2, { duration: 400 }), -1, true);
   circle2.value = withDelay(100, withRepeat(withTiming(2, { duration: 400 }), -1, true));
   circle3.value = withDelay(200, withRepeat(withTiming(2, { duration: 400 }), -1, true));

   const OnBlur = () => {};

   return (
      <Pressable style={styles.container} onPress={OnBlur}>
         <Animated.View style={[styles.circle, circle1_style]} />
         <Animated.View style={[styles.circle, circle2_style, DSS.mx10]} />
         <Animated.View style={[styles.circle, circle3_style]} />
      </Pressable>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
   },
   circle: {
      width: 10,
      height: 10,
      backgroundColor: 'red',
      borderRadius: 10,
   },
});

export default AnimationSwitcher;
