import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatTime } from '../utils/helpers';

export interface AttendanceCardProps {
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'outside_office';
  checkInLat?: number;
  checkInLng?: number;
  checkOutLat?: number;
  checkOutLng?: number;
  checkInPhoto?: string;
  checkOutPhoto?: string;
  onPhotoPress?: (photo: string) => void;
  testID?: string;
}

/**
 * AttendanceCard component - Displays attendance status with times, location, and photo
 * Shows check-in and check-out information with status badge
 */
export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  checkInTime,
  checkOutTime,
  status,
  checkInLat,
  checkInLng,
  checkOutLat,
  checkOutLng,
  checkInPhoto,
  checkOutPhoto,
  onPhotoPress,
  testID = 'attendance-card',
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'present':
        return '#44bb44';
      case 'late':
        return '#ff9800';
      case 'absent':
        return '#ff4444';
      case 'outside_office':
        return '#ff6666';
      default:
        return '#999999';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'late':
        return 'Late';
      case 'absent':
        return 'Absent';
      case 'outside_office':
        return 'Outside Office';
      default:
        return 'Unknown';
    }
  };

  // const formatTime = (time?: string): string => {
  //   if (!time) return 'N/A';
  //   try {
  //     const date = new Date(time);
  //     return date.toLocaleTimeString('en-IN', {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       second: '2-digit',
  //     });
  //   } catch {
  //     return time;
  //   }
  // };

  const formatCoordinates = (lat?: number, lng?: number): string => {
    if (lat === undefined || lng === undefined) return 'N/A';
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Status</Text>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <Text style={styles.statusText}>{getStatusLabel()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Check-In Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="login" size={20} color="#0066cc" />
            <Text style={styles.sectionTitle}>Check-In</Text>
          </View>
          <View style={styles.sectionContent}>
            {checkInTime && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>{formatTime(checkInTime)}</Text>
              </View>
            )}
            {checkInLat !== undefined && checkInLng !== undefined && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.value}>
                  {formatCoordinates(checkInLat, checkInLng)}
                </Text>
              </View>
            )}
            {checkInPhoto && (
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={() => onPhotoPress?.(checkInPhoto)}
              >
                <Image
                  source={{ uri: checkInPhoto }}
                  style={styles.photoThumbnail}
                />
                <Text style={styles.photoLabel}>View Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Check-Out Section */}
        {checkOutTime && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="logout" size={20} color="#0066cc" />
              <Text style={styles.sectionTitle}>Check-Out</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>{formatTime(checkOutTime)}</Text>
              </View>
              {checkOutLat !== undefined && checkOutLng !== undefined && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.value}>
                    {formatCoordinates(checkOutLat, checkOutLng)}
                  </Text>
                </View>
              )}
              {checkOutPhoto && (
                <TouchableOpacity
                  style={styles.photoContainer}
                  onPress={() => onPhotoPress?.(checkOutPhoto)}
                >
                  <Image
                    source={{ uri: checkOutPhoto }}
                    style={styles.photoThumbnail}
                  />
                  <Text style={styles.photoLabel}>View Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionContent: {
    paddingLeft: 28,
    gap: 8,
  },
  infoRow: {
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
    flex: 1,
    textAlign: 'right',
  },
  photoContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  photoLabel: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '600',
  },
});
