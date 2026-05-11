import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import {
  type Recorder,
  useCameraDevices,
  useMicrophonePermission,
  usePhotoOutput,
  useVideoOutput,
} from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { CameraModeSelector, type CameraMode } from '../components/CameraModeSelector';
import { CameraSelectorButton } from '../components/CameraSelectorButton';
import { CameraView } from '../components/CameraView';
import { CaptureButton } from '../components/CaptureButton';
import { LastMediaThumbnail, type LastMediaThumbnailRef } from '../components/LastMediaThumbnail';
import { RecordingTimer } from '../components/RecordingTimer';
import { useCameraLocation } from '../hooks/useCameraLocation';
import { useIsActive } from '../hooks/useIsActive';
import { useSafeAreaPadding } from '../hooks/useSafeAreaPadding';
import { logDevices } from '../logDevices';

export function CameraScreen() {
  // Core hooks
  const isAppActive = useIsActive();
  const isScreenFocused = useIsFocused();
  const safePadding = useSafeAreaPadding();
  const location = useCameraLocation();
  const microphone = useMicrophonePermission();

  // Mode is the only state that truly needs re-render (changes UI layout)
  const [mode, setMode] = useState<CameraMode>('photo');

  // Recording state: SharedValue for UI animations, ref for logic
  const isRecordingSV = useSharedValue(false);
  const isRecordingRef = useRef(false);
  const recordingTime = useSharedValue(0);
  const timerRef = useRef<NodeJS.Timeout>();

  // Thumbnail ref — updates thumbnail without re-rendering CameraScreen
  const thumbnailRef = useRef<LastMediaThumbnailRef>(null);

  // Devices
  const devices = useCameraDevices();
  const defaultDevice = devices[0];
  const [device, setDevice] = useState(defaultDevice);

  useEffect(() => {
    setDevice(defaultDevice);
  }, [defaultDevice]);

  useEffect(() => logDevices(devices), [devices]);

  // Outputs (stable references)
  const photoOptions = useMemo(() => ({}), []);
  const photoOutput = usePhotoOutput(photoOptions);

  const videoOptions = useMemo(
    () => ({ enableAudio: microphone.hasPermission }),
    [microphone.hasPermission],
  );
  const videoOutput = useVideoOutput(videoOptions);
  const outputs = useMemo(() => [photoOutput, videoOutput], [photoOutput, videoOutput]);

  // --- Timer helpers (no state, purely ref + shared value) ---
  const startTimer = useCallback(() => {
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      recordingTime.value = Date.now() - startTime;
    }, 100);
  }, [recordingTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    recordingTime.value = 0;
  }, [recordingTime]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  // --- Save to gallery (async, no state) ---
  const saveToGallery = useCallback(async (filePath: string, type: 'photo' | 'video') => {
    const uri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

    try {
      // Critical Fix for Android: Check if the file has an extension (contains a dot)
      // Vision Camera sometimes returns paths like "...mp4" instead of "...mp4"
      // CameraRoll will crash natively if it can't find a dot to guess the MIME type.
      const fileName = uri.split('/').pop() || '';
      if (!fileName.includes('.')) {
        console.log(
          `[CameraRoll] Skipping save: Filename "${fileName}" has no extension dot. Android MediaStore will reject this.`,
        );
        return;
      }

      console.log(`[CameraRoll] Saving ${type}: ${uri}`);

      // Using .save() as suggested by community fix
      await CameraRoll.save(uri, {
        type: type === 'video' ? 'video' : 'photo',
        album: 'Camera',
      });

      console.log(`[CameraRoll] Success: ${type} saved to gallery`);
    } catch (error) {
      console.log(`[CameraRoll] Failed to save ${type}:`, error);
    }
  }, []);

  // --- Photo action (no state changes in CameraScreen) ---
  const takePhoto = useCallback(async () => {
    try {
      console.log('Capturing Photo...');
      const photo = await photoOutput.capturePhoto({ location: location.currentLocation }, {});

      // Vision Camera v5: Photo is in-memory, save to temp file first
      const tempPath = await photo.saveToTemporaryFileAsync();
      const photoUri = tempPath.startsWith('file://') ? tempPath : `file://${tempPath}`;
      photo.dispose();

      // Update thumbnail (only LastMediaThumbnail re-renders)
      thumbnailRef.current?.setMedia(photoUri, 'photo');

      // Save to gallery in background
      saveToGallery(photoUri, 'photo');

      console.log('Photo captured & saved:', photoUri);
    } catch (e) {
      console.error('Failed to take Photo!', e);
    }
  }, [photoOutput, location.currentLocation, saveToGallery]);

  // --- Video actions (shared value + ref, no setState) ---
  const activeRecorder = useRef<Recorder>(undefined);

  const startRecording = useCallback(async () => {
    try {
      if (activeRecorder.current != null) return;
      console.log('Starting Recording...');

      const recorder = await videoOutput.createRecorder({});
      activeRecorder.current = recorder;

      // Update shared value (animates CaptureButton on UI thread)
      isRecordingSV.value = true;
      isRecordingRef.current = true;
      startTimer();

      await recorder.startRecording(
        path => {
          console.log('Recording finished! Path:', path);
          activeRecorder.current = undefined;
          isRecordingSV.value = false;
          isRecordingRef.current = false;
          stopTimer();

          // Use original path for playback (file exists at this path)
          const videoUri = path.startsWith('file://') ? path : `file://${path}`;

          // Update thumbnail (only LastMediaThumbnail re-renders)
          thumbnailRef.current?.setMedia(videoUri, 'video');

          // Save to gallery in background (extension fix happens inside)
          saveToGallery(videoUri, 'video');
        },
        error => {
          console.error('Failed to record!', error);
          activeRecorder.current = undefined;
          isRecordingSV.value = false;
          isRecordingRef.current = false;
          stopTimer();
        },
      );
    } catch (e) {
      console.error('Failed to start recording!', e);
      isRecordingSV.value = false;
      isRecordingRef.current = false;
      stopTimer();
    }
  }, [videoOutput, isRecordingSV, startTimer, stopTimer, saveToGallery]);

  const stopRecording = useCallback(async () => {
    try {
      const recorder = activeRecorder.current;
      if (recorder == null) return;
      activeRecorder.current = undefined;
      await recorder.stopRecording();
      console.log('Recording stopped!');
      // Note: isRecording state is cleared in the onRecordingFinished callback
    } catch (e) {
      console.error('Failed to stop recording!', e);
      isRecordingSV.value = false;
      isRecordingRef.current = false;
      stopTimer();
    }
  }, [isRecordingSV, stopTimer]);

  // --- Unified capture handler ---
  const handleCapture = useCallback(() => {
    if (mode === 'photo') {
      takePhoto();
    } else {
      if (isRecordingRef.current) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  }, [mode, takePhoto, startRecording, stopRecording]);

  // --- Render ---
  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDeviceText}>No Camera Device Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Camera Preview */}
      {isScreenFocused && (
        <CameraView
          isActive={isAppActive}
          device={device}
          outputs={outputs}
          photo={true}
          video={true}
          audio={microphone.hasPermission}
          mirrorMode={device.position === 'front' ? 'on' : 'off'}
          onError={error => console.error('Camera error:', error)}
        />
      )}

      {/* Controls Overlay */}
      <View style={[styles.overlay, safePadding]}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <RecordingTimer elapsedTime={recordingTime} />
          <CameraSelectorButton devices={devices} setDevice={setDevice} />
        </View>

        {/* Spacer */}
        <View style={styles.flex} />

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <CameraModeSelector mode={mode} setMode={setMode} />

          <View style={styles.captureRow}>
            {/* Thumbnail — self-contained re-renders */}
            <View style={styles.sideSlot}>
              <LastMediaThumbnail ref={thumbnailRef} />
            </View>

            {/* Capture Button — driven by SharedValue, no re-render */}
            <CaptureButton mode={mode} isRecording={isRecordingSV} onPress={handleCapture} />

            {/* Balance slot */}
            <View style={styles.sideSlot} />
          </View>
        </View>
      </View>
    </View>
  );
}

import { s, vs, fs } from '@/theme/Responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  noDeviceText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fs(16),
    fontWeight: '500',
  },
  flex: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingTop: vs(12),
  },
  bottomControls: {
    paddingBottom: vs(24),
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(20),
  },
  sideSlot: {
    flex: 1,
    alignItems: 'center',
  },
});
