import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSoundWithStates } from 'react-native-nitro-sound';
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';
import RecorderHeader from '../components/RecorderHeader';
import { IconMic, IconWave, IconVolume, IconSpeed } from '../components/RecorderIcons';
import { audioSet } from './SoundScreen';

interface SoundHookStatesScreenProps {
  onBack: () => void;
}

export const SoundHookStatesScreen = memo(({ onBack }: SoundHookStatesScreenProps) => {
  const styles = useStyles(createStyles);
  const [recordingPath, setRecordingPath] = useState('');
  const [volume, setVolume] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [isRecordLoading, setIsRecordLoading] = useState(false);
  const [isStopLoading, setIsStopLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [isPlayLoading, setIsPlayLoading] = useState(false);

  const {
    state,
    startRecorder,
    pauseRecorder,
    resumeRecorder,
    stopRecorder,
    startPlayer,
    pausePlayer,
    resumePlayer,
    stopPlayer,
    seekToPlayer,
    setVolume: setVolumeApi,
    setPlaybackSpeed: setPlaybackSpeedApi,
    mmssss,
  } = useSoundWithStates();

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

  const onStartRecord = useCallback(async () => {
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
    try {
      setIsRecordLoading(true);
      setLoadingMessage('Configuring...');
      const uri = await startRecorder(undefined, audioSet, true);
      setRecordingPath(uri);
    } catch (e) {
      Alert.alert('Start record error', String(e));
    } finally {
      setIsRecordLoading(false);
    }
  }, [startRecorder]);

  const onStartPlay = useCallback(async () => {
    try {
      setIsPlayLoading(true);
      const pathToPlay =
        Platform.OS === 'web' && recordingPath === 'recording_in_progress'
          ? undefined
          : recordingPath || undefined;
      await startPlayer(pathToPlay);
      await setVolumeApi(volume);
      await setPlaybackSpeedApi(speed);
    } catch (e) {
      Alert.alert('Play error', String(e));
    } finally {
      setIsPlayLoading(false);
    }
  }, [startPlayer, recordingPath, volume, speed, setVolumeApi, setPlaybackSpeedApi]);

  const handleStopRecorder = useCallback(async () => {
    try {
      setIsStopLoading(true);
      const path = await stopRecorder();
      if (Platform.OS === 'android') {
        Alert.alert('Recording Stopped', `File saved at:\n${path}`);
      }
    } catch (e) {
      Alert.alert('Stop record error', String(e));
    } finally {
      setIsStopLoading(false);
    }
  }, [stopRecorder]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
  }, []);

  const handleSpeedChange = useCallback((v: number) => {
    setSpeed(v);
  }, []);

  const durTxt = mmssss(Math.floor(state.playback.duration || 0));
  const posTxt = mmssss(Math.floor(state.playback.position || 0));

  return (
    <View style={styles.root}>
      <RecorderHeader title="Sound Hook and States" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Recorder Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <IconMic color={styles.primaryColor.color} size={20} />
              <Text style={styles.cardTitle}>Recorder (State Driven)</Text>
            </View>
            <View
              style={[styles.badge, state.isRecording ? styles.badgeActive : styles.badgeInactive]}>
              <Text style={state.isRecording ? styles.badgeTextActive : styles.badgeTextInactive}>
                {state.isRecording ? 'Recording' : 'Idle'}
              </Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {mmssss(Math.floor(state.recording.position || 0))}
            </Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnPrimary,
                (isRecordLoading || state.isRecording) && styles.btnDisabled,
              ]}
              onPress={onStartRecord}
              disabled={isRecordLoading || state.isRecording}
              activeOpacity={0.8}>
              {isRecordLoading ? (
                <View style={styles.btnContent}>
                  <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                  <Text style={styles.btnText}>{loadingMessage}</Text>
                </View>
              ) : (
                <Text style={styles.btnText}>Record</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary, !state.isRecording && styles.btnDisabled]}
              onPress={pauseRecorder}
              disabled={!state.isRecording}
              activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>Pause</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary, !state.isRecording && styles.btnDisabled]}
              onPress={resumeRecorder}
              disabled={!state.isRecording}
              activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnDanger,
                (!state.isRecording || isStopLoading) && styles.btnDisabled,
              ]}
              onPress={handleStopRecorder}
              disabled={!state.isRecording || isStopLoading}
              activeOpacity={0.8}>
              <View style={styles.btnContent}>
                {isStopLoading && (
                  <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                )}
                <Text style={styles.btnText}>{isStopLoading ? 'Stopping...' : 'Stop'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Player Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <IconWave color={styles.successColor.color} size={20} />
              <Text style={styles.cardTitle}>Player (State Driven)</Text>
            </View>
            <View
              style={[styles.badge, state.isPlaying ? styles.badgeSuccess : styles.badgeInactive]}>
              <Text style={state.isPlaying ? styles.badgeTextSuccess : styles.badgeTextInactive}>
                {state.isPlaying ? 'Playing' : 'Idle'}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.timeLabel}>
              {posTxt} / {durTxt}
            </Text>

            {Platform.OS === 'ios' ? (
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={Math.max(1, state.playback.duration || 0)}
                value={state.playback.position || 0}
                onSlidingComplete={seekToPlayer}
                minimumTrackTintColor={styles.successColor.color}
                maximumTrackTintColor={styles.sliderTrack.color}
                thumbTintColor={styles.successColor.color}
              />
            ) : (
              <View style={styles.androidProgressBar}>
                <View
                  style={[
                    styles.androidProgressFill,
                    {
                      width: `${
                        ((state.playback.position || 0) /
                          Math.max(1, state.playback.duration || 0)) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
            )}
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnSuccess,
                (isPlayLoading || state.isPlaying) && styles.btnDisabled,
              ]}
              onPress={onStartPlay}
              disabled={isPlayLoading || state.isPlaying}
              activeOpacity={0.8}>
              {isPlayLoading ? (
                <View style={styles.btnContent}>
                  <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                  <Text style={styles.btnText}>Loading...</Text>
                </View>
              ) : (
                <Text style={styles.btnText}>Play</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary, !state.isPlaying && styles.btnDisabled]}
              onPress={pausePlayer}
              disabled={!state.isPlaying}
              activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>Pause</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary, state.isPlaying && styles.btnDisabled]}
              onPress={resumePlayer}
              disabled={state.isPlaying}
              activeOpacity={0.8}>
              <Text style={styles.btnTextSecondary}>Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnDanger,
                !state.isPlaying && (state.playback.position || 0) === 0 && styles.btnDisabled,
              ]}
              onPress={stopPlayer}
              disabled={!state.isPlaying && (state.playback.position || 0) === 0}
              activeOpacity={0.8}>
              <Text style={styles.btnText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Audio Controls Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <IconVolume color={styles.warningColor.color} size={20} />
              <Text style={styles.cardTitle}>Audio Configuration</Text>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <IconVolume color={styles.mutedText.color} size={18} />
              <Text style={styles.settingLabel}>Volume</Text>
              <Text style={styles.settingValue}>{Math.round(volume * 100)}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={volume}
              onValueChange={handleVolumeChange}
              onSlidingComplete={setVolumeApi}
              minimumTrackTintColor={styles.warningColor.color}
              maximumTrackTintColor={styles.sliderTrack.color}
              thumbTintColor={styles.warningColor.color}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <IconSpeed color={styles.mutedText.color} size={18} />
              <Text style={styles.settingLabel}>Speed</Text>
              <Text style={styles.settingValue}>{speed.toFixed(1)}x</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2}
              step={0.1}
              value={speed}
              onValueChange={handleSpeedChange}
              onSlidingComplete={setPlaybackSpeedApi}
              minimumTrackTintColor={styles.warningColor.color}
              maximumTrackTintColor={styles.sliderTrack.color}
              thumbTintColor={styles.warningColor.color}
            />
          </View>
        </View>

        {recordingPath ? (
          <View style={styles.pathCard}>
            <Text style={styles.pathTitle}>Saved File Path:</Text>
            <Text style={styles.pathText} numberOfLines={3} selectTextOnFocus>
              {recordingPath}
            </Text>
          </View>
        ) : null}
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
      marginBottom: 16,
    },
    timeLabel: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
      fontWeight: '500',
    },
    slider: {
      width: '100%',
      height: 40,
    },
    androidProgressBar: {
      width: '100%',
      height: 6,
      backgroundColor: theme.mode === 'dark' ? '#1E293B' : '#E2E8F0',
      borderRadius: 3,
      marginVertical: 17,
      overflow: 'hidden',
    },
    androidProgressFill: {
      height: '100%',
      backgroundColor: '#10B981',
      borderRadius: 3,
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
    btnPrimary: {
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
    settingRow: {
      marginBottom: 14,
    },
    settingLabelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    settingLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginLeft: 6,
      flex: 1,
    },
    settingValue: {
      fontSize: 13,
      fontWeight: 'bold',
      color: theme.primary,
    },
    pathCard: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    pathTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.textSecondary,
      marginBottom: 4,
    },
    pathText: {
      fontSize: 11,
      color: theme.textMuted,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      lineHeight: 14,
    },
    primaryColor: { color: theme.primary },
    successColor: { color: theme.success },
    warningColor: { color: theme.warning },
    mutedText: { color: theme.textMuted },
    sliderTrack: { color: theme.mode === 'dark' ? '#334155' : '#CBD5E1' },
  });
