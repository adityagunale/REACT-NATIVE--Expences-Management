import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUser } from './src/redux/slices/authSlice';

export default function App() {
  // Check for token and load user on app start
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          store.dispatch(loadUser() as any);
        }
      } catch (error) {
        console.log('Error checking token:', error);
      }
    };

    checkToken();
  }, []);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <AppNavigator />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
