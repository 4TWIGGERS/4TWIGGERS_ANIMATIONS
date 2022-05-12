import { StyleSheet, View } from 'react-native';
import { TabBarInteraction, MicroInteraction, AnimTabBarButton, RubberSlider } from './src/screens';

export default function App() {
   return (
      <View style={styles.container}>
         {/* <MicroInteraction /> */}
         <AnimTabBarButton />
         {/* {<TabBarInteraction />} */}
         {/* <RubberSlider /> */}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
});
