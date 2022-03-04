import { StyleSheet, View } from 'react-native';
import { AnimationSwitcher, AnimTabBarButton, TabBarInteraction } from './src/screens';

export default function App() {
   return (
      <View style={styles.container}>
         {/* <TabBarInteraction /> */}
         {/* <AnimTabBarButton /> */}
         <AnimationSwitcher />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
});
