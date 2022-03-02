import { Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withTiming,
   withDelay,
   withSpring,
} from 'react-native-reanimated';

const MARGIN_LEFT = 30;
const LINE_WIDTHS = [40, 34, 28];
const SDGHSH = LINE_WIDTHS[0] + MARGIN_LEFT;
const puch = LINE_WIDTHS.map((item) => {
   return (LINE_WIDTHS[0] - item) / 2;
});

const Pres = ({ onPress, style }) => {
   return (
      <TouchableOpacity onPress={onPress} style={[styles.viewCont, style]}>
         {LINE_WIDTHS.map((width, index) => (
            <View key={index} style={[styles.view, { width }]} />
         ))}
      </TouchableOpacity>
   );
};

const AnimView = ({ progress, index }) => {
   const width = 40 - index * 6;
   const indicatorOffset = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateX: withDelay(
                  index * 50,
                  withTiming(progress.value * (SDGHSH + puch[index]), {
                     duration: 400,
                  })
               ),
            },
         ],
      };
   });
   return <Animated.View style={[styles.animView, { width }, indicatorOffset]} />;
};

const AnimTabBarButton = () => {
   const progress = useSharedValue(0);
   const scaleValue = useSharedValue(1);

   const scaleStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               scale: withSpring(scaleValue.value, { duration: 400 }, () => {
                  scaleValue.value = 1;
               }),
            },
         ],
      };
   });

   return (
      <View style={styles.container}>
         <Animated.View style={[styles.cont, scaleStyle]}>
            {['K', 'L', 'E'].map((_, index) => {
               const onPress = () => {
                  progress.value = index;
                  scaleValue.value = 0.97;
               };

               const bus = index === 0 ? 'flex-start' : index === 1 ? 'center' : 'flex-end';

               return <Pres key={index} onPress={onPress} style={{ alignItems: bus }} />;
            })}

            <View style={styles.puchusCont} pointerEvents='none'>
               {['PU', 'CH', 'U'].map((_, index) => {
                  return <AnimView key={index} progress={progress} index={index} />;
               })}
            </View>
         </Animated.View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'lightgrey',
   },
   animView: {
      height: 4,
      backgroundColor: 'red',
      marginTop: 6,
      marginLeft: MARGIN_LEFT,
      borderRadius: 2,
   },
   cont: {
      position: 'absolute',
      flexDirection: 'row',
      bottom: 200,
      backgroundColor: 'white',
      left: 86,
      right: 86,
      paddingVertical: 40,
      borderRadius: 20,
      alignItems: 'center',
   },
   view: {
      height: 4,
      backgroundColor: 'grey',
      marginTop: 6,
      borderRadius: 2,
   },
   viewCont: {
      marginLeft: MARGIN_LEFT,
   },
   puchusCont: {
      ...StyleSheet.absoluteFill,
      paddingVertical: 40,
   },
});

export default AnimTabBarButton;
