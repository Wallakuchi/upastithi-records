import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useAuthStore} from '../store/authStore';
import {attendanceApi} from '../api/endpoints';
import {AttendanceRecord} from '../types/index';
import {Button} from '../components/Button';
import Toast from 'react-native-toast-message';
import { formatTime, getStatusColor, getStatusLabel } from '../utils/helpers';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {user} = useAuthStore();
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString(),
  );
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  );

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch today's attendance
  const fetchTodayAttendance = async (showLoader = true) => {
    if (!user?.id) return;

    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await attendanceApi.getToday();

      console.log(
        'TODAY ATTENDANCE API =>',
        JSON.stringify(response?.data, null, 2),
      );

      if (response?.data?.data) {
        setTodayAttendance(response.data.data);
      } else {
        setTodayAttendance(null);
      }
    } catch (error) {
      console.error('Failed to fetch today attendance:', error);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load attendance data',
      });
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // Refresh whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTodayAttendance(false);
    }, []),
  );

  // Initial load
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodayAttendance(false);
    setRefreshing(false);
  };

  const handleCheckIn = () => {
    if (todayAttendance?.check_in_time) {
      Toast.show({
        type: 'info',
        text1: 'Info',
        text2: 'You have already checked in today',
      });
      return;
    }
    navigation.navigate('Attendance', {type: 'check-in'});
  };

  const handleCheckOut = () => {
    if (!todayAttendance?.check_in_time) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'You must check in first before checking out',
      });
      return;
    }
    if (todayAttendance?.check_out_time) {
      Toast.show({
        type: 'info',
        text1: 'Info',
        text2: 'You have already checked out today',
      });
      return;
    }
    navigation.navigate('Attendance', {type: 'check-out'});
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <Icon name="account-circle" size={48} color="#0066cc" />
      </View>

      <View style={styles.dateTimeCard}>
        <View style={styles.timeSection}>
          <Text style={styles.time}>{currentTime}</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <View style={styles.designationSection}>
          <Text style={styles.designationLabel}>Designation</Text>
          <Text style={styles.designation}>{user?.designation}</Text>
          <Text style={styles.designationLabel}>Department</Text>
          <Text style={styles.designation}>{user?.department}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Button
          title="Check IN"
          onPress={handleCheckIn}
          variant="primary"
          size="large"
          disabled={!!todayAttendance?.check_in_time}
          style={styles.checkInButton}
        />
        <Button
          title="Check OUT"
          onPress={handleCheckOut}
          variant="secondary"
          size="large"
          disabled={
            !todayAttendance?.check_in_time || !!todayAttendance?.check_out_time
          }
          style={styles.checkOutButton}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : todayAttendance ? (
        <View style={styles.attendanceCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Attendance</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(
                    todayAttendance.attendance_status,
                  ),
                },
              ]}>
              <Text style={styles.statusText}>
                {getStatusLabel(todayAttendance.attendance_status)}
              </Text>
            </View>
          </View>

          <View style={styles.attendanceDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Icon name="login" size={20} color="#0066cc" />
                <Text style={styles.detailLabel}>Check In</Text>
                <Text style={styles.detailValue}>
                  {formatTime(todayAttendance.check_in_time)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailItem}>
                <Icon name="logout" size={20} color="#ff6b6b" />
                <Text style={styles.detailLabel}>Check Out</Text>
                <Text style={styles.detailValue}>
                  {formatTime(todayAttendance.check_out_time)}
                </Text>
              </View>
            </View>

            {todayAttendance.check_in_lat && todayAttendance.check_in_lng && (
              <View style={styles.locationInfo}>
                <Icon name="map-marker" size={16} color="#666" />
                <Text style={styles.locationText}>
                  Location: {todayAttendance.check_in_lat.toFixed(4)},
                  {todayAttendance.check_in_lng.toFixed(4)}
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.noDataCard}>
          <Icon name="calendar-blank" size={48} color="#ccc" />
          <Text style={styles.noDataText}>No attendance marked today</Text>
          <Text style={styles.noDataSubtext}>
            Tap Check IN to start your day
          </Text>
        </View>
      )}

      <View style={styles.quickStatsContainer}>
        <Text style={styles.statsTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="check-circle" size={32} color="#44bb44" />
            <Text style={styles.statLabel}>Present</Text>
            <Text style={styles.statValue}>--</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="clock-alert" size={32} color="#ff9800" />
            <Text style={styles.statLabel}>Late</Text>
            <Text style={styles.statValue}>--</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="calendar-check" size={32} color="#0066cc" />
            <Text style={styles.statLabel}>Leave</Text>
            <Text style={styles.statValue}>--</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 14,
    color: '#999',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  dateTimeCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  timeSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  time: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  designationSection: {
    gap: 8,
  },
  designationLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  designation: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  checkInButton: {
    flex: 1,
  },
  checkOutButton: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  attendanceDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  noDataCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  noDataSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  quickStatsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    marginTop: 4,
  },
});
