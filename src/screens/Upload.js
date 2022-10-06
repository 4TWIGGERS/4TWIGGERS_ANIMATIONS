import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import Animated, {
   interpolate,
   useAnimatedStyle,
   useDerivedValue,
   useSharedValue,
   withDelay,
   withTiming,
   useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { height, width } = Dimensions.get('screen');
const TEXT_UPLOAD = ['d', 'a', 'o', 'l', 'p', 'U'];
const TEXT_DONE = ['D', 'o', 'n', 'e'];
const ARR_CIRCLE = new Array(5).fill('');
const SVG_WIDTH = 195;
const MARGIN_LEFT = (width - SVG_WIDTH) / 2;

const UploadComp = ({ i, t, textUploadValue }) => {
   const delayed = useDerivedValue(() => {
      return withDelay(i * 50, withTiming(textUploadValue.value));
   });
   const style = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateY: interpolate(delayed.value, [1, 0], [0, 10]),
            },
            {
               scale: interpolate(delayed.value, [1, 0], [1, 0]),
            },
         ],
      };
   });
   return (
      <Animated.Text style={[{ color: 'white', fontWeight: 'bold', fontSize: 20 }, style]}>
         {t}
      </Animated.Text>
   );
};

const DoneComp = ({ i, t, textDoneValue }) => {
   const delayed = useDerivedValue(() => {
      return withDelay(i * 50, withTiming(textDoneValue.value));
   });
   const style = useAnimatedStyle(() => {
      return {
         transform: [
            {
               translateY: interpolate(delayed.value, [1, 0], [0, 10]),
            },
            {
               scale: interpolate(delayed.value, [0, 1], [0, 1]),
            },
         ],
      };
   });
   return (
      <View style={{ flexDirection: 'row', left: 4 }}>
         <View />
         <Animated.Text
            style={[{ color: 'white', fontWeight: 'bold', fontSize: 20, top: 6 }, style]}>
            {t}
         </Animated.Text>
      </View>
   );
};

const Upload = () => {
   const leftToBend = useSharedValue(0);
   const rightToBend = useSharedValue(0);

   const textUploadValue = useSharedValue(1);
   const textDoneValue = useSharedValue(0);

   const firstPartOfTick = useSharedValue(0);
   const secondPartOfTick = useSharedValue(0);

   const [valuesCircleY] = useState(ARR_CIRCLE.map(() => useSharedValue(0)));
   const [valuesCircleScale] = useState(ARR_CIRCLE.map(() => useSharedValue(0)));

   const [stylesCircle] = useState(
      ARR_CIRCLE.map((_, i) =>
         useAnimatedStyle(() => {
            return {
               height: 10,
               width: 10,
               backgroundColor: 'white',
               marginLeft: i === 0 ? 0 : 10,
               borderRadius: 8,
               transform: [
                  {
                     scale: interpolate(valuesCircleScale[i].value, [0, 1], [0, 1]),
                  },
                  {
                     translateY: interpolate(valuesCircleY[i].value, [0, 1], [0, -10]),
                  },
               ],
            };
         })
      )
   );

   const firstPartOfTickStyle = useAnimatedStyle(() => {
      return {
         height: firstPartOfTick.value ? withTiming(12, { duration: 219 }) : withTiming(0),
         opacity: firstPartOfTick.value ? withTiming(1) : withTiming(0),
      };
   });
   const secondPartOfTickStyle = useAnimatedStyle(() => {
      return {
         width: secondPartOfTick.value ? withTiming(20) : 0,
      };
   });

   const path = useDerivedValue(() => {
      return `m ${MARGIN_LEFT} 265 c 65 ${leftToBend.value} 130 ${rightToBend.value} ${SVG_WIDTH} 0 c 0 20 0 40 0 60 c -65 ${rightToBend.value} -130 ${leftToBend.value} -195 0`;
   });

   const pathProps = useAnimatedProps(() => {
      return {
         d: path.value,
      };
   });

   const _toBend = () => {
      leftToBend.value = withDelay(
         800,
         withTiming(-30, { duration: 295 }, () => {
            leftToBend.value = withTiming(30, { duration: 295 }, () => {
               leftToBend.value = withTiming(0);
            });
         })
      );
      rightToBend.value = withDelay(
         800,
         withTiming(30, { duration: 295 }, () => {
            rightToBend.value = withTiming(-30, { duration: 295 }, () => {
               rightToBend.value = withTiming(0);
            });
         })
      );
   };

   const _onStartAnimation = () => {
      textUploadValue.value = withTiming(0, { duration: 300 }, _toBend());
      for (let i = 0; i < ARR_CIRCLE.length; i++) {
         valuesCircleY[i].value = withDelay(
            i * 100,
            withDelay(
               800,
               withTiming(1, { duration: 295 }, () => {
                  valuesCircleY[i].value = withTiming(0, {}, () => {
                     valuesCircleScale[i].value = withDelay(
                        200,
                        withTiming(0, {}, () => {
                           firstPartOfTick.value = withTiming(1);
                           secondPartOfTick.value = withDelay(
                              70,
                              withTiming(1, {}, () => {
                                 textDoneValue.value = withTiming(1);
                              })
                           );
                        })
                     );
                  });
               })
            )
         );
         valuesCircleScale[i].value = withDelay(i * 100, withDelay(800, withTiming(1)));
      }
   };

   return (
      <View style={styles.cont}>
         <Pressable onPress={_onStartAnimation} style={{ position: 'absolute', width, height }} />
         <View style={styles.iconCont}>
            <View style={{ flexDirection: 'row' }}>
               <View style={styles.tickCont1}>
                  <Animated.View style={[styles.tick1, firstPartOfTickStyle]} />
               </View>
               <View style={styles.tickCont2}>
                  <Animated.View style={[styles.tick2, secondPartOfTickStyle]} />
               </View>
            </View>
            {TEXT_DONE.map((t, i) => (
               <DoneComp {...{ t, i, textDoneValue }} key={i} />
            ))}
         </View>
         <View style={styles.uploadCont}>
            {TEXT_UPLOAD.map((t, i) => (
               <UploadComp {...{ t, i, textUploadValue }} key={i} />
            ))}
         </View>
         <View style={styles.circleCont}>
            {ARR_CIRCLE.map((_, i) => {
               return <Animated.View style={stylesCircle[i]} key={i} />;
            })}
         </View>
         <Svg style={{ height, width }}>
            <AnimatedPath animatedProps={pathProps} fill='black' strokeLinecap='round' />
         </Svg>
      </View>
   );
};

export default Upload;

const styles = StyleSheet.create({
   cont: {
      flex: 1,
      alignItems: 'center',
   },
   row: {
      flexDirection: 'row',
   },
   bubble: {
      width: 4,
      height: 4,
      margin: 2,
      borderRadius: 100,
      backgroundColor: 'red',
   },
   uploadCont: {
      flexDirection: 'row-reverse',
      position: 'absolute',
      top: 282,
      zIndex: 2000,
   },
   tick2: {
      width: 16,
      height: 4,
      backgroundColor: 'white',
      borderRadius: 4,
   },
   tickCont2: {
      width: 16,
      height: 4,
      top: 18,
      left: -7,
      borderRadius: 4,
      transform: [
         {
            rotate: -40 + 'deg',
         },
      ],
   },
   tickCont1: {
      width: 4,
      height: 10,
      top: 15,
      left: -5,
      borderRadius: 4,
      transform: [
         {
            rotate: -40 + 'deg',
         },
      ],
   },
   tick1: {
      width: 4,
      height: 12,
      backgroundColor: 'white',
      borderRadius: 4,
   },
   circleCont: {
      flexDirection: 'row',
      position: 'absolute',
      top: 290,
      zIndex: 1000,
   },
   iconCont: {
      flexDirection: 'row',
      position: 'absolute',
      top: 276,
      zIndex: 2000,
   },
});
