import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { createSound } from 'react-native-nitro-sound';
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';

const TEST_AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
];

export const RapidSwitchTest = memo(() => {
  const styles = useStyles(createStyles);
  const soundRef = useRef(createSound());
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState(-1);
  const scrollRef = useRef<ScrollView>(null);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLog(prev => [...prev, `${timestamp}: ${message}`]);
  }, []);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [testLog]);

  // Cleanup on unmount
  useEffect(() => {
    const sound = soundRef.current;
    return () => {
      sound.stopPlayer().catch(() => {});
      try {
        sound.dispose();
      } catch {
        // ignore
      }
    };
  }, []);

  const rapidSwitchTest = useCallback(async () => {
    setIsTestRunning(true);
    setTestLog([]);
    addLog('Starting rapid switch test...');

    try {
      for (let i = 0; i < 10; i++) {
        const trackIndex = i % TEST_AUDIO_URLS.length;
        const url = TEST_AUDIO_URLS[trackIndex];

        addLog(`Starting track ${trackIndex + 1}...`);
        setCurrentTrack(trackIndex);

        try {
          await soundRef.current.startPlayer(url);
          addLog(`Playing track ${trackIndex + 1}`);

          // Play for a short time (100-500ms)
          await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));

          addLog(`Stopping track ${trackIndex + 1}...`);
          await soundRef.current.stopPlayer();
          addLog(`Stopped track ${trackIndex + 1}`);

          // Very short delay between switches (0-100ms)
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        } catch (error) {
          addLog(`ERROR on track ${trackIndex + 1}: ${error}`);
          Alert.alert('Error', `Failed on track ${trackIndex + 1}: ${error}`);
          break;
        }
      }

      addLog('Test completed successfully!');
      Alert.alert('Success', 'Rapid switch test completed without errors!');
    } catch (error) {
      addLog(`Test failed: ${error}`);
      Alert.alert('Test Failed', `${error}`);
    } finally {
      setIsTestRunning(false);
      setCurrentTrack(-1);
      try {
        await soundRef.current.stopPlayer();
      } catch {
        // ignore
      }
    }
  }, [addLog]);

  const stressTest = useCallback(async () => {
    setIsTestRunning(true);
    setTestLog([]);
    addLog('Starting stress test (immediate switches)...');

    try {
      for (let i = 0; i < 20; i++) {
        const trackIndex = i % TEST_AUDIO_URLS.length;
        const url = TEST_AUDIO_URLS[trackIndex];

        addLog(`Quick switch ${i + 1}...`);

        try {
          const startPromise = soundRef.current.startPlayer(url);
          const stopPromise = soundRef.current.stopPlayer();

          await Promise.all([startPromise, stopPromise]).catch(err => {
            addLog(`Concurrent operation ${i + 1}: ${err}`);
          });
        } catch (error) {
          addLog(`ERROR on switch ${i + 1}: ${error}`);
          if (error instanceof Error && error.toString().includes('already resolved')) {
            Alert.alert('Bug Found!', 'Promise already resolved error occurred!');
            throw error;
          }
        }
      }

      addLog('Stress test completed!');
      Alert.alert('Success', 'Stress test completed!');
    } catch (error) {
      addLog(`Stress test failed: ${error}`);
      Alert.alert('Stress Test Failed', `${error}`);
    } finally {
      setIsTestRunning(false);
      try {
        await soundRef.current.stopPlayer();
      } catch {
        // ignore
      }
    }
  }, [addLog]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rapid Audio Switch Test</Text>
      <Text style={styles.subtitle}>Testing for concurrent promise rejection conflicts</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isTestRunning && styles.buttonDisabled]}
          onPress={rapidSwitchTest}
          disabled={isTestRunning}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {isTestRunning ? 'Test Running...' : 'Start Rapid Switch Test'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stressButton, isTestRunning && styles.buttonDisabled]}
          onPress={stressTest}
          disabled={isTestRunning}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {isTestRunning ? 'Test Running...' : 'Start Stress Test'}
          </Text>
        </TouchableOpacity>
      </View>

      {currentTrack >= 0 && (
        <View style={styles.trackLabelContainer}>
          <Text style={styles.currentTrack}>Currently playing: Track {currentTrack + 1}</Text>
        </View>
      )}

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Test Log:</Text>
        <ScrollView
          ref={scrollRef}
          style={styles.logScrollView}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.logScrollContent}>
          {testLog.map((log, index) => {
            const isError = log.includes('ERROR');
            const isSuccess =
              log.includes('SUCCESS') || log.includes('successfully') || log.includes('completed');
            return (
              <Text
                key={index}
                style={[
                  styles.logEntry,
                  isError && styles.errorLog,
                  isSuccess && styles.successLog,
                ]}>
                {log}
              </Text>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 6,
      textAlign: 'center',
      color: theme.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 20,
      textAlign: 'center',
    },
    buttonContainer: {
      marginBottom: 20,
      gap: 12,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    stressButton: {
      backgroundColor: theme.error,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: '#white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    trackLabelContainer: {
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 20,
      alignSelf: 'center',
    },
    currentTrack: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.success,
    },
    logContainer: {
      flex: 1,
      backgroundColor: theme.card,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    logScrollView: {
      flex: 1,
    },
    logScrollContent: {
      paddingBottom: 20,
    },
    logTitle: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.text,
    },
    logEntry: {
      fontSize: 12,
      marginBottom: 6,
      lineHeight: 16,
      color: theme.textSecondary,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    errorLog: {
      color: theme.error,
      fontWeight: 'bold',
    },
    successLog: {
      color: theme.success,
      fontWeight: 'bold',
    },
  });
