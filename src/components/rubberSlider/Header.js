import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Icon } from 'components/common';

export default function Header({ onSettingsPress }) {
   return (
      <View style={styles.root}>
         <Icon name='logo' resizeMode='contain' />
         <TouchableOpacity onPress={onSettingsPress}>
            <Icon name='settings' resizeMode='contain' />
         </TouchableOpacity>
      </View>
   );
}
const styles = StyleSheet.create({
   root: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingBottom: 24,
      paddingTop: 24 + getStatusBarHeight(),
   },
});
