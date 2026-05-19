import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface HeaderAction {
  icon?: string;
  label?: string;
  onPress: () => void;
  testID?: string;
}

export interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  actions?: HeaderAction[];
  backgroundColor?: string;
  textColor?: string;
  testID?: string;
}

/**
 * Header component - Navigation header with back button, title, and action buttons
 * Includes safe area padding for notched devices
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  actions = [],
  backgroundColor = '#fff',
  textColor = '#333',
  testID = 'header',
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, paddingTop: insets.top },
      ]}
      testID={testID}
    >
      <View style={styles.content}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            testID={`${testID}-back`}
          >
            <Icon name="chevron-left" size={28} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        <Text
          style={[styles.title, { color: textColor }]}
          numberOfLines={1}
          testID={`${testID}-title`}
        >
          {title}
        </Text>

        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={action.onPress}
              testID={action.testID}
            >
              {action.icon && (
                <Icon name={action.icon} size={24} color={textColor} />
              )}
              {action.label && (
                <Text style={[styles.actionLabel, { color: textColor }]}>
                  {action.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
});
