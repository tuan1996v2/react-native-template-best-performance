import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import VideoSection from '../components/VideoSection';
import { useSound } from 'react-native-nitro-sound';
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';
import RecorderHeader from '../components/RecorderHeader';
import { IconMic, IconWave, IconVideo } from '../components/RecorderIcons';
import { audioSet } from './SoundScreen';

interface CompatibilityScreenProps {
  onBack: () => void;
}

export const CompatibilityScreen = memo(({ onBack }: CompatibilityScreenProps) => {
  const styles = useStyles(createStyles);
  const [mountVideo, setMountVideo] = useState(true);
  const [disableVideoAudioSession, setDisableVideoAudioSession] = useState(false);
  const [paused, setPaused] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPath, setRecordingPath] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [recordPosition, setRecordPosition] = useState(0);
  const [isRecordLoading, setIsRecordLoading] = useState(false);
  const [isStopLoading, setIsStopLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const {
    startRecorder,
    pauseRecorder,
    resumeRecorder,
    stopRecorder,
    startPlayer,
    pausePlayer,
    resumePlayer,
    stopPlayer,
    mmssss,
  } = useSound({
    onRecord: useCallback(e => {
      setIsRecording(e.isRecording ?? false);
      setRecordPosition(e.currentPosition ?? 0);
    }, []),
    onPlayback: useCallback(e => {
      setDuration(e.duration);
      setPlaybackPosition(e.currentPosition);
    }, []),
    onPlaybackEnd: useCallback(e => {
      setIsPlaying(false);
      setDuration(e.duration);
      setPlaybackPosition(e.currentPosition);
    }, []),
  });

  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return true;
    const sdk = Platform.Version as number;
    if (sdk >= 33) {
      const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      return res === PermissionsAndroid.RESULTS.GRANTED;
    }
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);
    return grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handleStartRecord = useCallback(async () => {
    setRecordError(null);
    try {
      if (!(await requestPermissions())) {
        Alert.alert('Permission required', 'Microphone permission needed');
        return;
      }
      // const audioSet = {
      //   AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      //   AudioSourceAndroid: AudioSourceAndroidType.MIC,
      //   AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      //   AVNumberOfChannelsKeyIOS: 2,
      //   AVFormatIDKeyIOS: 'aac' as const,
      //   AVModeIOS: 'measurement' as const,
      // };
      setIsRecordLoading(true);
      setLoadingMessage('Configuring...');
      await startRecorder(undefined, audioSet, true);
      setRecordingPath('');
      setIsRecording(true);
      setRecordPosition(0);
    } catch (e) {
      const msg = String(e);
      setRecordError(msg);
      Alert.alert('Start record error', msg);
    } finally {
      setIsRecordLoading(false);
    }
  }, [startRecorder]);

  const handleStopRecord = useCallback(async () => {
    try {
      setIsStopLoading(true);
      const path = await stopRecorder();
      setRecordingPath(path);
    } catch (e) {
      Alert.alert('Stop record error', String(e));
    } finally {
      setIsRecording(false);
      setIsStopLoading(false);
    }
  }, [stopRecorder]);

  const handleStartPlayRecording = useCallback(async () => {
    if (!recordingPath) {
      Alert.alert('No recording', 'Record something first.');
      return;
    }
    try {
      await startPlayer(recordingPath);
      setIsPlaying(true);
    } catch (e) {
      Alert.alert('Play error', String(e));
    }
  }, [startPlayer, recordingPath]);

  const handlePausePlayer = useCallback(async () => {
    try {
      await pausePlayer();
      setIsPlaying(false);
    } catch {
      // ignore
    }
  }, [pausePlayer]);

  const handleResumePlayer = useCallback(async () => {
    try {
      await resumePlayer();
      setIsPlaying(true);
    } catch {
      // ignore
    }
  }, [resumePlayer]);

  const handleStopPlayer = useCallback(async () => {
    try {
      await stopPlayer();
    } finally {
      setIsPlaying(false);
    }
  }, [stopPlayer]);

  return (
    <View style={styles.root}>
      <RecorderHeader title="Compatibility: RN Video" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Video Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <IconVideo color={styles.primaryColor.color} size={20} />
              <Text style={styles.cardTitle}>Video View (react-native-video)</Text>
            </View>
          </View>

          <VideoSection
            mountVideo={mountVideo}
            paused={paused}
            onPausedChange={setPaused}
            disableAudioSessionManagement={disableVideoAudioSession}
          />

          <View style={styles.separator} />

          <View style={styles.rowBetween}>
            <Text style={styles.settingLabel}>Mount Video Component</Text>
            <Switch
              value={mountVideo}
              onValueChange={setMountVideo}
              trackColor={{ false: '#767577', true: styles.primaryColor.color }}
              thumbColor={Platform.OS === 'android' ? '#f4f3f4' : undefined}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.settingLabel}>Disable Audio Session Mgmt</Text>
            <Switch
              value={disableVideoAudioSession}
              onValueChange={setDisableVideoAudioSession}
              trackColor={{ false: '#767577', true: styles.primaryColor.color }}
              thumbColor={Platform.OS === 'android' ? '#f4f3f4' : undefined}
            />
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.settingLabel}>Pause Video Player</Text>
            <Switch
              value={paused}
              onValueChange={setPaused}
              trackColor={{ false: '#767577', true: styles.primaryColor.color }}
              thumbColor={Platform.OS === 'android' ? '#f4f3f4' : undefined}
            />
          </View>
        </View>

        {/* Recorder Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <IconMic color={styles.accentColor.color} size={20} />
              <Text style={styles.cardTitle}>Recorder (Nitro Sound)</Text>
            </View>
            <View style={[styles.badge, isRecording ? styles.badgeActive : styles.badgeInactive]}>
              <Text style={isRecording ? styles.badgeTextActive : styles.badgeTextInactive}>
                {isRecording ? 'Recording' : 'Idle'}
              </Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{mmssss(Math.floor(recordPosition))}</Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnAccent,
                (isRecordLoading || isRecording) && styles.btnDisabled,
              ]}
              onPress={handleStartRecord}
              disabled={isRecordLoading || isRecording}
              activeOpacity={0.8}>
              {isRecordLoading ? (
                <View style={styles.btnContent}>
                  <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                  <Text style={styles.btnText}>{loadingMessage}</Text>
                </View>
              ) : (
                <Text style={styles.btnText}>Start</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnSecondary,
                (isRecordLoading || !isRecording) && styles.btnDisabled,
              ]}
              onPress={() => pauseRecorder().catch(() => {})}
              disabled={isRecordLoading || !isRecording}
              activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>Pause</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnSecondary,
                (isRecordLoading || !isRecording) && styles.btnDisabled,
              ]}
              onPress={() => resumeRecorder().catch(() => {})}
              disabled={isRecordLoading || !isRecording}
              activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnDanger,
                (!isRecording || isStopLoading) && styles.btnDisabled,
              ]}
              onPress={handleStopRecord}
              disabled={!isRecording || isStopLoading}
              activeOpacity={0.8}>
              <View style={styles.btnContent}>
                {isStopLoading && (
                  <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                )}
                <Text style={styles.btnText}>{isStopLoading ? 'Stopping...' : 'Stop'}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {recordError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {recordError}</Text>
            </View>
          ) : (
            <View style={styles.tipContainer}>
              <Text style={styles.tipText}>
                Tip: On iOS, mount the Video, keep it paused, then try Start Record. Toggle "Disable
                Audio Session Mgmt" to test conflicts.
              </Text>
            </View>
          )}
        </View>

        {/* Player Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <IconWave color={styles.successColor.color} size={20} />
              <Text style={styles.cardTitle}>Player (Nitro Sound)</Text>
            </View>
            <View style={[styles.badge, isPlaying ? styles.badgeSuccess : styles.badgeInactive]}>
              <Text style={isPlaying ? styles.badgeTextSuccess : styles.badgeTextInactive}>
                {isPlaying ? 'Playing' : 'Idle'}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.timeLabel}>
              {mmssss(Math.floor(playbackPosition))} / {mmssss(Math.floor(duration))}
            </Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnSuccess,
                (!recordingPath || isPlaying || isRecording) && styles.btnDisabled,
              ]}
              onPress={handleStartPlayRecording}
              disabled={!recordingPath || isPlaying || isRecording}
              activeOpacity={0.8}>
              <Text style={styles.btnText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary, !isPlaying && styles.btnDisabled]}
              onPress={handlePausePlayer}
              disabled={!isPlaying}
              activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>Pause</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary, isPlaying && styles.btnDisabled]}
              onPress={handleResumePlayer}
              disabled={isPlaying}
              activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnDanger,
                !isPlaying && playbackPosition === 0 && styles.btnDisabled,
              ]}
              onPress={handleStopPlayer}
              disabled={!isPlaying && playbackPosition === 0}
              activeOpacity={0.8}>
              <Text style={styles.btnText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      padding: 16,
      paddingBottom: 40,
      gap: 16,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    cardTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    separator: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 14,
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    settingLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    badgeActive: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    badgeSuccess: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
    },
    badgeInactive: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    },
    badgeTextActive: {
      fontSize: 11,
      fontWeight: '600',
      color: '#EF4444',
    },
    badgeTextSuccess: {
      fontSize: 11,
      fontWeight: '600',
      color: '#3B82F6',
    },
    badgeTextInactive: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    timerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: 12,
      marginBottom: 16,
    },
    timerText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    progressContainer: {
      marginVertical: 8,
    },
    timeLabel: {
      fontSize: 14,
      color: theme.text,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    btnRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    btn: {
      flex: 1,
      minWidth: 70,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    btnAccent: {
      backgroundColor: theme.primary,
    },
    btnSuccess: {
      backgroundColor: theme.success,
    },
    btnDanger: {
      backgroundColor: theme.error,
    },
    btnSecondary: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
      borderColor: theme.border,
    },
    btnDisabled: {
      opacity: 0.4,
    },
    btnContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinner: {
      marginRight: 6,
    },
    btnText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: 'bold',
    },
    btnTextSecondary: {
      color: theme.text,
      fontSize: 13,
      fontWeight: 'bold',
    },
    errorContainer: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      padding: 12,
      borderRadius: 10,
      marginTop: 14,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    errorText: {
      fontSize: 12,
      color: '#EF4444',
      fontWeight: 'bold',
    },
    tipContainer: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      padding: 12,
      borderRadius: 10,
      marginTop: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tipText: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 16,
    },
    primaryColor: { color: theme.primary },
    accentColor: { color: theme.primary },
    successColor: { color: theme.success },
  });
