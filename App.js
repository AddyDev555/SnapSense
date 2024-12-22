import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Camera from './components/Camera';

export default function App() {
  const api_key = process.env.EXPO_PUBLIC_API_KEY;

  return (
    <View style={styles.container}>
      <Camera />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
