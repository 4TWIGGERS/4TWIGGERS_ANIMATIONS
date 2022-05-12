import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withTiming,
   withDelay,
   withSpring,
} from 'react-native-reanimated';
import { DSS } from 'styles';

const MARGIN_LEFT = 72;
const LINE_WIDTHS = [MARGIN_LEFT, 66, 58];
const STARTING_POSITION = LINE_WIDTHS[0] + MARGIN_LEFT;
const LINES_POSITION = LINE_WIDTHS.map((item) => {
   return (LINE_WIDTHS[0] - item) / 2;
});

const arr = [1, 2, 3].valueOf();

const Pres = ({ progress, scaleValue, index }) => {
   const alignItemsLines = index === 0 ? 'flex-start' : index === 1 ? 'center' : 'flex-end';

   const onPress = () => {
      progress.value = index;
      scaleValue.value = withSpring(0.97, { duration: 400 }, () => {
         scaleValue.value = withSpring(1);
      });
   };

   return (
      <TouchableOpacity
         onPress={onPress}
         style={[styles.viewCont, { alignItems: alignItemsLines }]}>
         {LINE_WIDTHS.map((width, index) => (
            <View key={index} style={[styles.view, { width }]} />
         ))}
      </TouchableOpacity>
   );
};

const AnimView = ({ progress, index, delay = 50 }) => {
   const width = MARGIN_LEFT - index * 6;
   const indicatorOffset = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateX: withDelay(
                  index * delay,
                  withTiming(progress.value * (STARTING_POSITION + LINES_POSITION[index]), {
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
               scale: scaleValue.value,
            },
         ],
      };
   });

   return (
      <View style={styles.container}>
         <Animated.View style={[styles.cont, scaleStyle]}>
            {arr.map((_, index) => {
               return <Pres key={index} {...{ progress, scaleValue, index }} />;
            })}
            <View style={[DSS.my40, { position: 'absolute' }]} pointerEvents='none'>
               {arr.map((_, index) => {
                  return <AnimView key={index} {...{ progress, index }} />;
               })}
            </View>
         </Animated.View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#121418',
      alignItems: 'center',
      justifyContent: 'center',
   },
   animView: {
      height: 5,
      backgroundColor: '#00C39A',
      marginTop: 9,
      marginLeft: MARGIN_LEFT,
      borderRadius: 6,
   },
   cont: {
      flexDirection: 'row',
      backgroundColor: '#000000',
      paddingVertical: 82,
      borderRadius: 20,
      alignItems: 'center',
      paddingRight: MARGIN_LEFT,
   },
   view: {
      height: 5,
      backgroundColor: 'grey',
      marginTop: 9,
      borderRadius: 6,
   },
   viewCont: {
      marginLeft: MARGIN_LEFT,
   },
});

export default AnimTabBarButton;
