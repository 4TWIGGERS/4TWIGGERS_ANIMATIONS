import { StyleSheet, View } from 'react-native';
import { TabBarInteraction, MicroInteraction } from './src/screens';

export default function App() {
   return (
      <View style={styles.container}>
         {/* {<TabBarInteraction />} */}
         <MicroInteraction />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
});
