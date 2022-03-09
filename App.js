import { StyleSheet, View } from 'react-native';
import { TabBarInteraction } from './src/screens';

export default function App() {
   return (
      <View style={styles.container}>
         <TabBarInteraction />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
});
