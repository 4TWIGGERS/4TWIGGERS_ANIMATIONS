import React from 'react';
import { TextInput } from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

Animated.addWhitelistedNativeProps({ text: true });

export default function AnimatedText({ style, text }) {
   const animatedText = useAnimatedProps(() => {
      return {
         text: text.value + '',
      };
   });

   return (
      <AnimatedTextInput
         underlineColorAndroid='transparent'
         style={style}
         editable={false}
         animatedProps={animatedText}
         value={text.value + ''}
      />
   );
}
