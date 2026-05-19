import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/endpoints';
import { User } from '../types/index';
import { Button } from '../components/Button';

/**
 * ProfileScreen - Display user profile info and account settings
 */
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();

  const [profileData, setProfileData] = useState<User | null>(user || null);
  const [loading, setLoading] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    if (!profileData && user) {
      setProfileData(user);
    }
  }, [user]);

  const handleChangePassword = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: 'Change password feature will be available soon',
    });
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: performLogout,
        style: 'destructive',
      },
    ]);
  };

  const performLogout = async () => {
    try {
      setLoadingLogout(true);

      // Try to logout from server, but don't fail if it errors
      try {
        await authApi.logout();
      } catch (apiError: any) {
        console.warn('Server logout failed, clearing local session:', apiError.message);
        // Continue with local logout even if server call fails
      }

      // Always clear local auth data
      await logout();

      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'An error occurred while logging out. Please try again.',
      });
    } finally {
      setLoadingLogout(false);
    }
  };

  if (!profileData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Icon name="account-circle" size={80} color="#0066cc" />
        </View>

        <Text style={styles.userName}>{profileData.name}</Text>
        <Text style={styles.userEmail}>{profileData.email}</Text>
        <Text style={styles.userCode}>ID: {profileData.employee_code}</Text>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Employee Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Icon name="briefcase" size={20} color="#0066cc" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Designation</Text>
              <Text style={styles.infoValue}>{profileData.designation}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Icon name="sitemap" size={20} color="#0066cc" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{profileData.department}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Icon name="shield-account" size={20} color="#0066cc" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{profileData.role}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
          <View style={styles.settingIcon}>
            <Icon name="lock" size={20} color="#0066cc" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingText}>Change Password</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.actionSection}>
        <Button
          title="Logout"
          onPress={handleLogout}
          loading={loadingLogout}
          variant="secondary"
          size="large"
          style={styles.logoutButton}
        />

        <Text style={styles.appVersion}>App Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userCode: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  settingItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  actionSection: {
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  logoutButton: {
    marginBottom: 16,
  },
  appVersion: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
