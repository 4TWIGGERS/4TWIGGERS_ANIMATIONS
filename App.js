import { StyleSheet, View } from 'react-native';
import { TabBarInteraction, MicroInteraction } from './src/screens';
import RubberSlider from './src/screens/RubberSlider';

export default function App() {
   return (
      <View style={styles.container}>
         <MicroInteraction />
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
