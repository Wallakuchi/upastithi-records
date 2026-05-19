import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export interface LoaderProps {
  visible?: boolean;
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  testID?: string;
}

/**
 * Loader component - Displays a centered activity indicator with optional message
 * Used for showing loading states during API calls and data fetching
 */
export const Loader: React.FC<LoaderProps> = ({
  visible = true,
  size = 'large',
  color = '#0066cc',
  message,
  testID = 'loader',
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loaderContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
});
