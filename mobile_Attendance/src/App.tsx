import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RootNavigator} from './navigation/RootNavigator';
import {useAuthStore} from './store/authStore';
import Toast from 'react-native-toast-message';

const App = () => {
  const {getCurrentUser, token} = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().restoreToken();
  }, []);

  useEffect(() => {
    if (token) {
      getCurrentUser().catch((error: any) => {
        console.error('Failed to get current user:', error);
      });
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <RootNavigator />
        {/* GLOBAL TOAST */}
        <Toast />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
