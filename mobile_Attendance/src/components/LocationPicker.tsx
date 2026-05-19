import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';

export interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number, accuracy?: number) => void;
  showAccuracy?: boolean;
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  testID?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

/**
 * LocationPicker component - Displays current GPS coordinates with update and refresh capabilities
 * Shows location status, accuracy, and handles permission checks
 */
export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  showAccuracy = true,
  enableAutoRefresh = false,
  refreshInterval = 30000,
  testID = 'location-picker',
}) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'unknown'>('unknown');

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (!enableAutoRefresh || !permissionStatus) {
      return;
    }

    const interval = setInterval(() => {
      fetchLocation();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, permissionStatus]);

  const checkLocationPermission = async () => {
    try {
      const hasPermission = await Geolocation.requestAuthorization('whenInUse');
      setPermissionStatus(hasPermission === 'granted' ? 'granted' : 'denied');
      return hasPermission === 'granted';
    } catch (err) {
      setPermissionStatus('denied');
      return false;
    }
  };

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = permissionStatus === 'granted' || (await checkLocationPermission());

      if (!hasPermission) {
        setError('Location permission not granted');
        setPermissionStatus('denied');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const locationData: LocationData = {
            latitude,
            longitude,
            accuracy,
            timestamp: Date.now(),
          };
          setLocation(locationData);
          onLocationSelect(latitude, longitude, accuracy);
        },
        (error) => {
          const errorMessage = error.message || 'Failed to get location';
          setError(errorMessage);
          Alert.alert('Location Error', errorMessage);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = () => {
    fetchLocation();
  };

  const getPermissionIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'check-circle-outline';
      case 'denied':
        return 'alert-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getPermissionColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return '#44bb44';
      case 'denied':
        return '#ff4444';
      default:
        return '#999999';
    }
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name="map-marker" size={20} color="#0066cc" />
          <Text style={styles.title}>Current Location</Text>
        </View>
        <View style={[styles.permissionBadge, { backgroundColor: getPermissionColor() }]}>
          <Icon
            name={getPermissionIcon()}
            size={14}
            color="#fff"
          />
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert" size={32} color="#ff4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : location ? (
        <View style={styles.locationContainer}>
          <View style={styles.coordinateRow}>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.value}>{location.latitude.toFixed(6)}</Text>
          </View>
          <View style={styles.coordinateRow}>
            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.value}>{location.longitude.toFixed(6)}</Text>
          </View>
          {showAccuracy && (
            <View style={styles.coordinateRow}>
              <Text style={styles.label}>Accuracy:</Text>
              <Text style={styles.value}>
                ±{(location.accuracy || 0).toFixed(1)}m
              </Text>
            </View>
          )}
          <Text style={styles.timestamp}>
            Updated: {formatTime(location.timestamp)}
          </Text>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Icon name="map-marker-question" size={32} color="#999" />
          <Text style={styles.placeholderText}>Location not fetched yet</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.updateButton, loading && styles.updateButtonDisabled]}
        onPress={handleUpdateLocation}
        disabled={loading}
        testID={`${testID}-update`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Icon name="refresh" size={18} color="#fff" />
            <Text style={styles.updateButtonText}>Update Location</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  permissionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: '#ff4444',
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 13,
    color: '#999',
  },
  updateButton: {
    flexDirection: 'row',
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
