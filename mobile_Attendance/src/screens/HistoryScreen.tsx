import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuthStore} from '../store/authStore';
import {attendanceApi} from '../api/endpoints';
import {AttendanceRecord} from '../types/index';
import Toast from 'react-native-toast-message';
import { formatTime, getStatusColor, getStatusLabel } from '../utils/helpers';

/**
 * HistoryScreen - Display attendance history with pull-to-refresh and infinite scroll
 */
export const HistoryScreen: React.FC = () => {
  const {user} = useAuthStore();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async (pageNum = 1, append = false) => {
    if (!user?.id) return;

    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await attendanceApi.getHistory(
        user.id,
        undefined,
        undefined,
        pageNum,
        20,
      );

      console.log(
        'HISTORY RESPONSE =>',
        JSON.stringify(response.data, null, 2),
      );

      const responseData = response?.data;

      const newRecords = responseData?.data || [];

      if (append) {
        setRecords(prev => [...prev, ...newRecords]);
      } else {
        setRecords(newRecords);
      }

      setPage(pageNum);

      // pagination
      const totalPages = responseData?.pagination?.totalPages || 1;

      setHasMore(pageNum < totalPages);
    } catch (error: any) {
      console.log(
        'HISTORY ERROR =>',
        JSON.stringify(error.response?.data, null, 2),
      );

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load attendance history',
      });

      if (!append) {
        setRecords([]);
      }
    } finally {
      if (!append) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAttendanceHistory(1, false);
    setRefreshing(false);
  }, [user?.id]);

  const onLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      fetchAttendanceHistory(page + 1, true);
    }
  }, [page, hasMore, loadingMore, loading]);

  // const getStatusColor = (status?: string) => {
  //   switch (status) {
  //     case ATTENDANCE_STATUS.PRESENT:
  //       return '#44bb44';
  //     case ATTENDANCE_STATUS.LATE:
  //       return '#ff9800';
  //     case ATTENDANCE_STATUS.ABSENT:
  //       return '#ff4444';
  //     case ATTENDANCE_STATUS.OUTSIDE_OFFICE:
  //       return '#ff6b6b';
  //     default:
  //       return '#999999';
  //   }
  // };

  // const getStatusLabel = (status?: string) => {
  //   switch (status) {
  //     case ATTENDANCE_STATUS.PRESENT:
  //       return 'Present';
  //     case ATTENDANCE_STATUS.LATE:
  //       return 'Late';
  //     case ATTENDANCE_STATUS.ABSENT:
  //       return 'Absent';
  //     case ATTENDANCE_STATUS.OUTSIDE_OFFICE:
  //       return 'Outside Office';
  //     default:
  //       return 'Not Marked';
  //   }
  // };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const renderAttendanceItem = ({
    item,
  }: ListRenderItemInfo<AttendanceRecord>) => (
    <TouchableOpacity style={styles.recordCard} activeOpacity={0.7}>
      <View style={styles.recordHeader}>
        <View>
          <Text style={styles.dateText}>
            {formatDate(item.attendance_date)}
          </Text>
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(item.attendance_status)},
              ]}>
              <Text style={styles.statusBadgeText}>
                {getStatusLabel(item.attendance_status)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.recordDetails}>
        <View style={styles.detailItem}>
          <Icon name="login" size={16} color="#0066cc" />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Check-In</Text>
            <Text style={styles.detailValue}>
              {formatTime(item.check_in_time)}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Icon name="logout" size={16} color="#ff6b6b" />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Check-Out</Text>
            <Text style={styles.detailValue}>
              {formatTime(item.check_out_time)}
            </Text>
          </View>
        </View>
      </View>

      {item.check_in_lat && item.check_in_lng && (
        <View style={styles.locationRow}>
          <Icon name="map-marker" size={14} color="#666" />
          <Text style={styles.locationText}>
            {item.check_in_lat.toFixed(4)}, {item.check_in_lng.toFixed(4)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0066cc" />
        <Text style={styles.footerLoaderText}>Loading more...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {records.length === 0 ? (
        <ScrollView
          style={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.emptyContent}>
          <Icon name="calendar-blank" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No attendance records yet</Text>
          <Text style={styles.emptySubtext}>
            Your attendance history will appear here
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={records}
          renderItem={renderAttendanceItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statusBadgeContainer: {
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  recordDetails: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 12,
    color: '#0066cc',
  },
});
