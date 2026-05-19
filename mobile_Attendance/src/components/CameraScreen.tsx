// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   Text,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// export interface CameraProps {
//   onCapture: (photoUri: string) => void;
//   onCancel?: () => void;
//   title?: string;
//   testID?: string;
// }

// /**
//  * Camera component - Wraps RNCamera with front camera access and capture functionality
//  * Displays camera preview, capture button, and error handling
//  */
// export const Camera: React.FC<CameraProps> = ({
//   onCapture,
//   onCancel,
//   title = 'Capture Selfie',
//   testID = 'camera',
// }) => {
//   const [cameraReady, setCameraReady] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [capturing, setCapturing] = useState(false);
//   const [previewUri, setPreviewUri] = useState<string | null>(null);
//   const cameraRef = useRef<RNCamera>(null);

//   useEffect(() => {
//     // Cleanup on unmount
//     return () => {
//       setCameraReady(false);
//       setPreviewUri(null);
//     };
//   }, []);

//   const handleCameraReady = () => {
//     setCameraReady(true);
//   };

//   const handleCameraError = (error: any) => {
//     const errorMessage =
//       error?.message || 'Camera access denied or unavailable';
//     setError(errorMessage);
//     Alert.alert('Camera Error', errorMessage);
//   };

//   const handleCapture = async () => {
//     if (!cameraRef.current || !cameraReady || capturing) {
//       return;
//     }

//     try {
//       setCapturing(true);
//       const data = await cameraRef.current.takePictureAsync({
//         quality: 0.7,
//         base64: false,
//         fastMode: true,
//       });

//       if (data.uri) {
//         setPreviewUri(data.uri);
//       }
//     } catch (err) {
//       const errorMsg = err instanceof Error ? err.message : 'Failed to capture photo';
//       setError(errorMsg);
//       Alert.alert('Capture Error', errorMsg);
//     } finally {
//       setCapturing(false);
//     }
//   };

//   const handleConfirmPhoto = () => {
//     if (previewUri) {
//       onCapture(previewUri);
//       setPreviewUri(null);
//     }
//   };

//   const handleRetake = () => {
//     setPreviewUri(null);
//   };

//   const handleCancel = () => {
//     setPreviewUri(null);
//     setError(null);
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   if (previewUri) {
//     return (
//       <View style={styles.previewContainer} testID={`${testID}-preview`}>
//         <Image source={{ uri: previewUri }} style={styles.previewImage} />
//         <View style={styles.previewControls}>
//           <TouchableOpacity
//             style={[styles.button, styles.retakeButton]}
//             onPress={handleRetake}
//           >
//             <Icon name="camera-retake" size={20} color="#fff" />
//             <Text style={styles.buttonText}>Retake</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.confirmButton]}
//             onPress={handleConfirmPhoto}
//           >
//             <Icon name="check-circle" size={20} color="#fff" />
//             <Text style={styles.buttonText}>Confirm</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer} testID={`${testID}-error`}>
//         <Icon name="camera-off" size={48} color="#ff4444" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container} testID={testID}>
//       <View style={styles.header}>
//         <Text style={styles.title}>{title}</Text>
//         <TouchableOpacity onPress={handleCancel}>
//           <Icon name="close" size={24} color="#333" />
//         </TouchableOpacity>
//       </View>

//       <RNCamera
//         ref={cameraRef}
//         style={styles.camera}
//         type={RNCamera.Constants.Type.front}
//         flashMode={RNCamera.Constants.FlashMode.off}
//         autoFocus={RNCamera.Constants.AutoFocus.on}
//         onCameraReady={handleCameraReady}
//         onMountError={handleCameraError}
//         captureAudio={false}
//       />

//       <View style={styles.controls}>
//         <TouchableOpacity
//           style={[styles.button, styles.captureButton, !cameraReady && styles.disabled]}
//           onPress={handleCapture}
//           disabled={!cameraReady || capturing}
//           testID={`${testID}-capture`}
//         >
//           {capturing ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <>
//               <Icon name="camera" size={24} color="#fff" />
//               <Text style={styles.buttonText}>Capture</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 8,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   camera: {
//     flex: 1,
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingBottom: 24,
//     backgroundColor: '#000',
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     gap: 8,
//   },
//   captureButton: {
//     backgroundColor: '#0066cc',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   disabled: {
//     opacity: 0.5,
//   },
//   previewContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   previewImage: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   previewControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 20,
//     paddingBottom: 24,
//     backgroundColor: '#1a1a1a',
//   },
//   retakeButton: {
//     backgroundColor: '#ff4444',
//   },
//   confirmButton: {
//     backgroundColor: '#44bb44',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//   },
//   errorText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'center',
//   },
//   cancelButton: {
//     marginTop: 24,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     backgroundColor: '#0066cc',
//     borderRadius: 8,
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

//Pasted new codes heade
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface CameraProps {
  onCapture: (photoUri: string) => void;
  onCancel?: () => void;
  title?: string;
  testID?: string;
}

export const CameraScreen: React.FC<CameraProps> = ({
  onCapture,
  onCancel,
  title = 'Capture Selfie',
  testID = 'camera',
}) => {
  const device = useCameraDevice('front');

  const cameraRef = useRef<Camera>(null);

  const {hasPermission, requestPermission} = useCameraPermission();

  const [capturing, setCapturing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) {
      return;
    }

    try {
      setCapturing(true);

      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
      });

      const uri = `file://${photo.path}`;

      setPreviewUri(uri);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to capture photo';

      Alert.alert('Capture Error', errorMsg);
    } finally {
      setCapturing(false);
    }
  };

  const handleConfirmPhoto = () => {
    if (previewUri) {
      onCapture(previewUri);
      setPreviewUri(null);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
  };

  const handleCancel = () => {
    setPreviewUri(null);

    if (onCancel) {
      onCancel();
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Camera permission is required
        </Text>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (previewUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{uri: previewUri}} style={styles.previewImage} />

        <View style={styles.previewControls}>
          <TouchableOpacity
            style={[styles.button, styles.retakeButton]}
            onPress={handleRetake}>
            <Icon name="camera-retake" size={20} color="#fff" />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirmPhoto}>
            <Icon name="check-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={handleCancel}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.captureButton]}
          onPress={handleCapture}
          disabled={capturing}>
          {capturing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Capture</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  camera: {
    flex: 1,
  },

  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#000',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },

  captureButton: {
    backgroundColor: '#0066cc',
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },

  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#111',
  },

  retakeButton: {
    backgroundColor: '#ff4444',
  },

  confirmButton: {
    backgroundColor: '#44bb44',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },

  errorText: {
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});