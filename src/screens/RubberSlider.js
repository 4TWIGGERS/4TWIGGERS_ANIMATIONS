import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, Text } from 'react-native';
import Svg, { Path, Defs, Pattern, Rect } from 'react-native-svg';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
   useAnimatedProps,
   useSharedValue,
   useAnimatedGestureHandler,
   useAnimatedStyle,
   withSpring,
   useDerivedValue,
   interpolate,
   concat,
} from 'react-native-reanimated';
import { Icon } from 'components/common';

import { AnimatedText, Header } from 'components/rubberSlider';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

let { height, width } = Dimensions.get('screen');

const primaryColor = '#1C0452';

const padding = 24;

const availableWidth = width - padding * 2;
const sliderY = height - height * 0.4;
const middleW = width / 2;
const knobSize = 22;

const pathHeight = 4;

const RubberSlider = () => {
   const [pathType, setPathType] = useState('linear');

   const knobY = useSharedValue(sliderY);
   const knobX = useSharedValue(middleW);

   const path = useDerivedValue(() => {
      if (pathType === 'linear') {
         let lX1 = knobX.value - knobSize / 2;
         let lY1 = knobY.value;
         if (lX1 < padding) lX1 = padding;

         let lX2 = knobX.value + knobSize / 2;
         if (lX2 > availableWidth + padding) lX2 = availableWidth + padding;

         const lY2 = knobY.value;

         return `M ${padding} ${sliderY} L ${lX1} ${lY1} L ${lX2} ${lY2} L ${
            availableWidth + padding
         } ${sliderY}`;
      }

      //More fixes required for quadratic path
      const diffX = knobX.value - middleW;
      const diffY = knobY.value - sliderY;

      const qX = middleW + diffX * 2 + padding;
      const qY = sliderY + diffY * 2;

      return `M ${padding} ${sliderY} Q ${qX} ${qY} ${availableWidth} ${sliderY}`;
   });

   const pathProps = useAnimatedProps(() => {
      return {
         d: path.value,
      };
   });

   const knobStyle = useAnimatedStyle(() => {
      return {
         transform: [
            { translateX: knobX.value - knobSize / 2 },
            { translateY: knobY.value - knobSize / 2 },
         ],
      };
   });

   const onGestureEvent = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
         ctx.offsetX = knobX.value;
         ctx.offsetY = knobY.value;
      },
      onActive: (event, ctx) => {
         let nextX = ctx.offsetX + event.translationX;
         if (nextX < padding) nextX = padding;
         else if (nextX > availableWidth + padding) nextX = availableWidth + padding;

         knobX.value = nextX;
         knobY.value = ctx.offsetY + event.translationY;
      },
      onEnd: () => {
         knobY.value = withSpring(sliderY, {
            damping: 3,
            stiffness: 150,
            mass: 0.5,
         });
      },
   });

   const percentage = useDerivedValue(() => {
      return ~~(((knobX.value - padding) / availableWidth) * 100);
   });

   const rect1Props = useAnimatedProps(() => {
      let x = knobX.value - availableWidth - knobSize / 2;

      //TODO: find better workaround for color overlap bug
      if (knobX.value <= padding * 2) {
         x += 20;
      }

      return {
         x,
      };
   });

   const rect2Props = useAnimatedProps(() => {
      let x = knobX.value + knobSize / 2;

      //TODO: find better workaround for color overlap bug
      if (knobX.value >= availableWidth - padding * 2) {
         x -= 20;
      }
      return {
         x,
      };
   });

   const imageStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               rotate: interpolate(percentage.value, [0, 100], [0, 1440]) + 'deg',
            },
         ],
      };
   });

   return (
      <View style={styles.container}>
         <View
            style={{
               height: height - sliderY,
               position: 'absolute',
               width: '100%',
            }}>
            <Header
               onSettingsPress={() => {
                  if (pathType === 'linear') setPathType('quadratic');
                  else setPathType('linear');
               }}
            />
            <Animated.View style={[styles.artist, imageStyle]}>
               <Icon name='artist' size={width - 110} />
            </Animated.View>

            <View style={styles.titleContainer}>
               <Text style={styles.title}>Billie Eilish</Text>
               <Text style={styles.subtitle}>Therefore I Am (Official Music)</Text>
            </View>

            <AnimatedText style={styles.durationLabel} text={percentage} />
            <View style={styles.buttonContainer}>
               <Icon name='prev' size={16} style={styles.button} resizeMode='contain' />
               <Icon name='pause' size={20} style={styles.button} resizeMode='contain' />
               <Icon name='next' size={16} style={styles.button} resizeMode='contain' />
            </View>
         </View>

         <Svg style={{ height, width }}>
            <Defs>
               <Pattern
                  id='pattern'
                  width={width}
                  height={pathHeight}
                  patternUnits='userSpaceOnUse'>
                  <AnimatedRect
                     animatedProps={rect1Props}
                     width={availableWidth}
                     height={pathHeight}
                     fill={primaryColor}
                  />
                  <AnimatedRect
                     animatedProps={rect2Props}
                     width={availableWidth}
                     height={pathHeight}
                     fill='#DDDDDD'
                  />
               </Pattern>
            </Defs>
            <AnimatedPath
               animatedProps={pathProps}
               stroke='url(#pattern)'
               strokeWidth={pathHeight}
               strokeLinecap='round'
            />
         </Svg>
         <PanGestureHandler {...{ onGestureEvent }}>
            <Animated.View style={[styles.knob, knobStyle]} />
         </PanGestureHandler>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F7F7F8',
   },
   knobContainer: {
      position: 'absolute',
   },
   titleContainer: {
      position: 'absolute',
      top: sliderY - 80,
      paddingHorizontal: 20,
   },
   title: {
      color: primaryColor,
      fontSize: 20,
      lineHeight: 25,
      fontWeight: 'bold',
   },
   subtitle: {
      color: primaryColor,
      fontSize: 16,
   },
   durationLabel: {
      position: 'absolute',
      paddingHorizontal: 24,
      top: sliderY + 10,
      fontSize: 12,
      color: primaryColor,
   },
   knob: {
      position: 'absolute',
      backgroundColor: '#1C0452',
      width: knobSize,
      height: knobSize,
      borderRadius: knobSize / 2,
   },
   text: {
      position: 'absolute',
      height: 40,
      color: 'black',
      fontSize: 40,
      top: 50,
   },
   artist: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      alignSelf: 'center',
   },
   buttonContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: 200,
      alignItems: 'center',
   },
   button: {
      marginHorizontal: 20,
   },
});

export default RubberSlider;
