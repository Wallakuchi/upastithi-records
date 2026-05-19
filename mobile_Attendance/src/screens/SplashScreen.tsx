import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { isTokenExpired } from '../utils/authUtils';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { restoreToken, getAccessToken } = useAuthStore.getState();

        // Restore tokens from storage
        await restoreToken();

        // Check if we have a valid token
        const accessToken = getAccessToken();

        if (accessToken && !isTokenExpired(accessToken)) {
          // Token is valid, navigate to home
          navigation.replace('Home');
        } else {
          // No valid token, navigate to login
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // On error, go to login
        navigation.replace('Login');
      }
    };

    // Add a small delay to show splash screen
    const timer = setTimeout(initializeAuth, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>📍</Text>
          <Text style={styles.title}>Upastithi</Text>
          <Text style={styles.subtitle}>Attendance Management</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a73e8" />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>

        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  version: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: '#ccc',
  },
});
