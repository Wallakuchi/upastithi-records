import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useAuthStore} from '../store/authStore';
import {Button} from '../components/Button';
import {Loader} from '../components/Loader';
import {CameraScreen} from '../components/CameraScreen';
import {AttendanceWorkflowService} from '../services/AttendanceWorkflowService';
import {GeoLocation} from '../types/index';
import {CloudinaryService} from '../services/CloudinaryService';

interface WorkflowStep {
  id: 'permission' | 'location' | 'radius' | 'camera' | 'upload';
  label: string;
  completed: boolean;
  loading: boolean;
  error?: string;
}

/**
 * AttendanceScreen - Complete check-in/check-out workflow with multi-step process
 * Steps: Request permission → Get location → Validate radius → Capture selfie → Upload
 */
export const AttendanceScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {user} = useAuthStore();

  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 'permission',
      label: 'Location Permission',
      completed: false,
      loading: false,
    },
    {
      id: 'location',
      label: 'Getting Location',
      completed: false,
      loading: false,
    },
    {
      id: 'radius',
      label: 'Verifying Office Radius',
      completed: false,
      loading: false,
    },
    {id: 'camera', label: 'Capturing Selfie', completed: false, loading: false},
    {id: 'upload', label: 'Uploading', completed: false, loading: false},
  ]);

  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  // const [selfieBase64, setSelfieBase64] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [workflowStarted, setWorkflowStarted] = useState(false);
  const [workflowComplete, setWorkflowComplete] = useState(false);
  /** Latest GPS fix — avoids stale closure if state hasn’t flushed before capture callback */
  const locationRef = useRef<GeoLocation | null>(null);

  const type = route.params?.type || 'check-in';
  const isCheckIn = type === 'check-in';

  useEffect(() => {
    // Initialize workflow service on mount
    AttendanceWorkflowService.initialize().catch(err => {
      console.error('Failed to initialize workflow service:', err);
    });
  }, []);

  // Update step status
  const updateStep = (
    id: WorkflowStep['id'],
    updates: Partial<WorkflowStep>,
  ) => {
    setSteps(prevSteps =>
      prevSteps.map(step => (step.id === id ? {...step, ...updates} : step)),
    );
  };

  // Start the attendance workflow
  const startWorkflow = async () => {
    if (!user?.id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User information not available',
      });
      return;
    }

    setWorkflowStarted(true);
    try {
      // Step 1: Request location permission and fetch location
      updateStep('permission', {loading: true});
      const startResult = await AttendanceWorkflowService.startCheckIn();

      if (!startResult.success) {
        updateStep('permission', {loading: false, error: startResult.error});
        Toast.show({
          type: 'error',
          text1: 'Location Error',
          text2: startResult.error,
        });
        return;
      }

      updateStep('permission', {completed: true, loading: false});

      // Step 2: Location fetched
      if (startResult.location) {
        locationRef.current = startResult.location;
        setLocation(startResult.location);
        updateStep('location', {completed: true, loading: false});

        // Step 3: Validate office radius
        updateStep('radius', {loading: true});
        const isValid = startResult.isWithinRadius ?? false;
        setIsWithinRadius(isValid);

        if (!isValid) {
          updateStep('radius', {
            loading: false,
            error: 'Outside office radius. Please move closer to office.',
            completed: false,
          });
          Toast.show({
            type: 'error',
            text1: 'Location Validation Failed',
            text2:
              'You are outside office radius. Please move closer to office.',
          });
          return;
        }

        updateStep('radius', {completed: true, loading: false});
      }

      // Step 4: Open camera for selfie
      updateStep('camera', {loading: true});
      setCameraVisible(true);
    } catch (error: any) {
      console.error('Workflow error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to start workflow',
      });
      setWorkflowStarted(false);
    }
  };

  // Handle selfie capture
  const handleSelfieCapture = async (uri: string) => {
    try {
      setSelfieUri(uri);
      setCameraVisible(false);
      updateStep('camera', {completed: true, loading: false});

      const loc = locationRef.current ?? location;
      if (!loc) {
        updateStep('upload', {
          loading: false,
          error: 'Location data missing. Please start check-in again.',
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Location data missing. Please start again.',
        });
        setWorkflowStarted(false);
        return;
      }

      if (!user?.id) {
        updateStep('upload', {
          loading: false,
          error: 'Not signed in.',
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User session missing.',
        });
        setWorkflowStarted(false);
        return;
      }

      // Convert image to base64
      updateStep('upload', {loading: true});
      // const base64Data = await convertImageToBase64(uri);
      // setSelfieBase64(base64Data);

      // const completeResult = isCheckIn
      //   ? await AttendanceWorkflowService.completeCheckIn(user.id, loc, base64Data)
      //   : await AttendanceWorkflowService.completeCheckOut(user.id, loc, base64Data);

      updateStep('upload', {loading: true});

      /**
       * Upload image to Cloudinary
       */
      const imageUrl = await CloudinaryService.uploadImage(uri);

      console.log('CLOUDINARY IMAGE URL => ', imageUrl);

      const completeResult = isCheckIn
        ? await AttendanceWorkflowService.completeCheckIn(
            user.id,
            loc,
            imageUrl,
          )
        : await AttendanceWorkflowService.completeCheckOut(
            user.id,
            loc,
            imageUrl,
          );

      if (completeResult.success) {
        updateStep('upload', {completed: true, loading: false});
        setWorkflowComplete(true);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2:
            completeResult.message ||
            `${isCheckIn ? 'Check-in' : 'Check-out'} recorded`,
        });

        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        updateStep('upload', {loading: false, error: completeResult.error});
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: completeResult.error,
        });
        setWorkflowStarted(false);
      }
    } catch (error: any) {
      console.error('Selfie capture error:', error);
      updateStep('camera', {loading: false, error: error.message});
      updateStep('upload', {loading: false, error: error.message});
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to process selfie',
      });
      setWorkflowStarted(false);
    }
  };

  // Convert image URI to base64
  // const convertImageToBase64 = async (uri: string): Promise<string> => {
  //   try {
  //     const RNFS = require('react-native-fs');
  //     const path = uri.startsWith('file://') ? uri.replace('file://', '') : uri;
  //     const base64 = await RNFS.readFile(path, 'base64');
  //     return base64;
  //   } catch (error) {
  //     console.error('Failed to convert image to base64:', error);
  //     throw new Error('Failed to process image');
  //   }
  // };

  const handleCameraCancel = () => {
    setCameraVisible(false);
    setWorkflowStarted(false);
    updateStep('camera', {loading: false});
  };

  const handleRetry = () => {
    setWorkflowStarted(false);
    locationRef.current = null;
    setSteps(prev =>
      prev.map(step => ({
        ...step,
        completed: false,
        loading: false,
        error: undefined,
      })),
    );
    setLocation(null);
    setIsWithinRadius(null);
    setSelfieUri(null);
    // setSelfieBase64(null);
    setWorkflowComplete(false);
  };

  return (
    <View style={styles.container}>
      {cameraVisible && (
        <CameraScreen
          onCapture={handleSelfieCapture}
          onCancel={handleCameraCancel}
          title="Capture Selfie"
        />
      )}

      {!cameraVisible && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon
                name={isCheckIn ? 'login' : 'logout'}
                size={24}
                color="#0066cc"
              />
              <Text style={styles.cardTitle}>
                {isCheckIn ? 'Check-In' : 'Check-Out'}
              </Text>
            </View>
          </View>

          {/* Workflow Steps */}
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={step.id}>
                <View style={styles.stepRow}>
                  <View style={styles.stepIndicator}>
                    {step.completed ? (
                      <Icon name="check-circle" size={24} color="#44bb44" />
                    ) : step.loading ? (
                      <ActivityIndicator color="#0066cc" size={24} />
                    ) : (
                      <View
                        style={[
                          styles.stepNumber,
                          step.error && styles.stepNumberError,
                        ]}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepLabel}>{step.label}</Text>
                    {step.error && (
                      <Text style={styles.stepError}>{step.error}</Text>
                    )}
                  </View>
                </View>

                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      (step.completed || step.error) && styles.stepLineActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Location Info */}
          {location && !cameraVisible && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Location Verified</Text>
              <View style={styles.infoBox}>
                <Icon name="map-marker" size={20} color="#44bb44" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>
                    {isWithinRadius
                      ? 'Within Office Radius'
                      : 'Outside Office Radius'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {location.latitude.toFixed(6)},{' '}
                    {location.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Selfie Preview */}
          {selfieUri && !cameraVisible && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Selfie Captured</Text>
              <Image source={{uri: selfieUri}} style={styles.previewImage} />
            </View>
          )}

          {/* Success Message */}
          {workflowComplete && (
            <View style={styles.card}>
              <View style={styles.successContainer}>
                <Icon name="check-circle" size={48} color="#44bb44" />
                <Text style={styles.successTitle}>
                  {isCheckIn ? 'Check-In Successful' : 'Check-Out Successful'}
                </Text>
                <Text style={styles.successSubtitle}>
                  Your attendance has been recorded
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            {!workflowStarted ? (
              <Button
                title={`Start ${isCheckIn ? 'Check-In' : 'Check-Out'}`}
                onPress={startWorkflow}
                variant="primary"
                size="large"
                style={styles.button}
              />
            ) : (
              !workflowComplete && (
                <Button
                  title="Cancel Workflow"
                  onPress={handleRetry}
                  variant="secondary"
                  size="large"
                  style={styles.button}
                />
              )
            )}

            {workflowComplete && (
              <Button
                title="Back to Home"
                onPress={() => navigation.goBack()}
                variant="primary"
                size="large"
                style={styles.button}
              />
            )}

            {!workflowComplete && workflowStarted && (
              <Button
                title="Retry"
                onPress={handleRetry}
                variant="secondary"
                size="large"
                style={styles.button}
              />
            )}
          </View>
        </ScrollView>
      )}

      {workflowStarted && !cameraVisible && !workflowComplete && (
        <Loader
          visible={true}
          message={steps.find(s => s.loading)?.label || 'Processing...'}
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  stepsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  stepNumberError: {
    backgroundColor: '#ffe6e6',
    borderColor: '#ff4444',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  stepError: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 4,
  },
  stepLine: {
    marginLeft: 16,
    height: 16,
    width: 2,
    backgroundColor: '#ddd',
  },
  stepLineActive: {
    backgroundColor: '#0066cc',
  },
  infoBox: {
    backgroundColor: '#f3fff3',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#44bb44',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 8,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#44bb44',
    marginTop: 12,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 8,
  },
});
