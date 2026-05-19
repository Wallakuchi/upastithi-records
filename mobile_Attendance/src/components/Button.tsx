import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

/**
 * Button component - Reusable button with variants, sizes, and loading state
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  testID = 'button',
}) => {
  const buttonStyle = [
    styles.button,
    styles[`${variant}Button` as keyof typeof styles],
    styles[`${size}Button` as keyof typeof styles],
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const textStyleComputed = [
    styles.text,
    styles[`${size}Text` as keyof typeof styles],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={textStyleComputed as TextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#44bb44',
  },
  secondaryButton: {
    backgroundColor: '#ff6b6b',
  },
  dangerButton: {
    backgroundColor: '#ff4444',
  },
  disabledButton: {
    opacity: 0.6,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  text: {
    fontWeight: '600',
    color: '#fff',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
