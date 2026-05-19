import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/authStore';
import { leaveApi } from '../api/endpoints';
import { LeaveRequest } from '../types/index';
import { Button } from '../components/Button';

type LeaveType = 'SICK' | 'CASUAL' | 'EARNED' | 'UNPAID' | 'MATERNITY';

/**
 * LeaveScreen - Create leave requests and view past leave history
 */
export const LeaveScreen: React.FC = () => {
  const { user } = useAuthStore();

  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [leaveType, setLeaveType] = useState<LeaveType>('CASUAL');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [showLeaveTypeMenu, setShowLeaveTypeMenu] = useState(false);

  const leaveTypes: LeaveType[] = ['CASUAL', 'SICK', 'EARNED', 'UNPAID', 'MATERNITY'];

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await leaveApi.getAll(1, 10);

      if (response?.data) {
        const leaveData = Array.isArray(response.data) ? response.data : response.data.data || [];
        setLeaveHistory(leaveData as LeaveRequest[]);
      }
    } catch (error) {
      console.error('Failed to fetch leave history:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load leave history',
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleFromDateChange = (date: Date) => {
    setFromDate(date);
    setShowFromDatePicker(false);
  };

  const handleToDateChange = (date: Date) => {
    setToDate(date);
    setShowToDatePicker(false);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a reason for leave',
      });
      return;
    }

    if (toDate < fromDate) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'End date cannot be before start date',
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        from_date: fromDate.toISOString().split('T')[0],
        to_date: toDate.toISOString().split('T')[0],
        leave_type: leaveType,
        reason: reason.trim(),
      };

      const response = await leaveApi.create(payload);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Leave request submitted successfully',
        });

        setReason('');
        setFromDate(new Date());
        setToDate(new Date());
        setLeaveType('CASUAL');

        await fetchLeaveHistory();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to submit leave request',
        });
      }
    } catch (error: any) {
      console.error('Leave submission error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to submit leave request',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '#44bb44';
      case 'REJECTED':
        return '#ff4444';
      case 'PENDING':
        return '#ff9800';
      default:
        return '#999999';
    }
  };

  const renderLeaveHistoryItem = ({ item }: ListRenderItemInfo<LeaveRequest>) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View>
          <Text style={styles.historyDates}>
            {formatDate(new Date(item.from_date))} - {formatDate(new Date(item.to_date))}
          </Text>
          <Text style={styles.historyLeaveType}>{item.leave_type}</Text>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
        >
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.historyReason}>{item.reason}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Leave Request Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Create Leave Request</Text>

          {/* From Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>From Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowFromDatePicker(true)}
            >
              <Icon name="calendar" size={20} color="#0066cc" />
              <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
            </TouchableOpacity>
            {showFromDatePicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => date && handleFromDateChange(date)}
              />
            )}
          </View>

          {/* To Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>To Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowToDatePicker(true)}
            >
              <Icon name="calendar" size={20} color="#0066cc" />
              <Text style={styles.dateText}>{formatDate(toDate)}</Text>
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => date && handleToDateChange(date)}
              />
            )}
          </View>

          {/* Leave Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Leave Type</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowLeaveTypeMenu(!showLeaveTypeMenu)}
            >
              <Text style={styles.selectText}>{leaveType}</Text>
              <Icon
                name={showLeaveTypeMenu ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {showLeaveTypeMenu && (
              <View style={styles.dropdown}>
                {leaveTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.dropdownItem,
                      type === leaveType && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setLeaveType(type);
                      setShowLeaveTypeMenu(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        type === leaveType && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                    {type === leaveType && (
                      <Icon name="check" size={18} color="#0066cc" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Reason */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Reason</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter reason for leave"
              placeholderTextColor="#999"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <Button
            title="Submit Leave Request"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            variant="primary"
            size="large"
            style={styles.submitButton}
          />
        </View>

        {/* Leave History */}
        <View style={styles.historySection}>
          <Text style={styles.historySectionTitle}>Leave History</Text>

          {historyLoading ? (
            <View style={styles.historyLoadingContainer}>
              <ActivityIndicator size="small" color="#0066cc" />
            </View>
          ) : leaveHistory.length === 0 ? (
            <View style={styles.historyEmptyContainer}>
              <Icon name="calendar-blank" size={48} color="#ccc" />
              <Text style={styles.historyEmptyText}>No leave requests yet</Text>
            </View>
          ) : (
            <FlatList
              data={leaveHistory}
              renderItem={renderLeaveHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
  },
  selectText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: '#0066cc',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  submitButton: {
    marginTop: 8,
  },
  historySection: {
    marginBottom: 32,
  },
  historySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  historyLoadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyEmptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyEmptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyDates: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyLeaveType: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  historyReason: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  separator: {
    height: 12,
  },
});
