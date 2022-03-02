import { StyleSheet, Text, View, TouchableOpacity, Pressable, FlatList } from 'react-native';
import React, { useRef, useState } from 'react';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   useDerivedValue,
   withTiming,
   withSpring,
   withDelay,
   interpolate,
   Extrapolate,
   runOnJS,
} from 'react-native-reanimated';

const AnimatedButton = Animated.createAnimatedComponent(Pressable);
const BUTTON_HEIGHT = 80;

const AnimationSwitcher = () => {
   const x = useSharedValue(0);
   const opacity = useSharedValue(0);
   const scale = useSharedValue(1);
   const rotate = useSharedValue(0);

   const width_height_interpolate = useDerivedValue(() => {
      return interpolate(x.value, [0, 1], [90, 60]);
   });
   const opacity_interpolate = useDerivedValue(() => {
      return interpolate(opacity.value, [0, 1], [0, 1]);
   });
   const scale_interpolate = useDerivedValue(() => {
      return interpolate(scale.value, [1, 0], [1, 0]);
   });
   const rotate_interpolate = useDerivedValue(() => {
      return interpolate(rotate.value, [0, 1], [0, 8]);
   });

   const scale_style = useAnimatedStyle(() => {
      return {
         opacity: opacity_interpolate.value,
         transform: [
            {
               scale: scale_interpolate.value,
            },
         ],
      };
   });

   const rotate_style = useAnimatedStyle(() => {
      return {
         transform: [
            {
               rotate: `${rotate_interpolate.value}deg`,
            },
         ],
      };
   });

   const OnPress = () => {
      // x.value = withTiming(0.9);
   };

   const OnBlur = () => {
      opacity.value = withTiming(1, { duration: 400 });
      scale.value = withSpring(0.5, { duration: 400 }, () => {
         scale.value = withSpring(1.8, {}, () => {
            scale.value = 1;
            opacity.value = 0;
         });
      });

      rotate.value = withTiming(1, {}, () => {
         rotate.value = withSpring(0);
      });
      // x.value = withTiming(1);
   };

   return (
      <Pressable style={styles.container} onPress={OnBlur}>
         {/* <AnimatedButton style={[styles.animCont, scale_style]} onPress={OnPress}></AnimatedButton> */}
         <Animated.View style={[styles.animContRotateq, rotate_style]}>
            <AnimatedButton style={[styles.animContRotate]} onPress={OnBlur}>
               {/* <Text style={{ color: 'white' }}>|</Text> */}
            </AnimatedButton>
         </Animated.View>
      </Pressable>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      // alignItems: 'center',
      justifyContent: 'center',
   },
   animCont: {
      width: 100,
      height: 100,
      // borderWidth: 1,
      borderRadius: 900,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(52, 51, 52, 0.09)',
   },
   animContRotate: {
      position: 'absolute',
      transform: [{ translateY: -BUTTON_HEIGHT / 2.5 }],
      width: 180,
      height: BUTTON_HEIGHT,
      borderRadius: 50,
      backgroundColor: '#0003',
   },
   animContRotateq: {
      width: 0,
      height: 0,
      marginLeft: 150,
      backgroundColor: 'red',
   },
});

export default AnimationSwitcher;
