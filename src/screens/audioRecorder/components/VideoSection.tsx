import React, { useRef, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useVideoPlayer, VideoView, VideoViewRef } from 'react-native-video';
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';

type Props = {
  mountVideo: boolean;
  paused: boolean;
  onPausedChange: (p: boolean) => void;
  disableAudioSessionManagement: boolean;
};

const mmssss = (milisecs: number) => {
  const totalSeconds = Math.floor(milisecs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centis = Math.floor((milisecs % 1000) / 10);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}:${pad(centis)}`;
};

const VideoSection = memo(({ mountVideo, paused, onPausedChange }: Props) => {
  const styles = useStyles(createStyles);
  const videoRef = useRef<VideoViewRef | null>(null);
  const videoDuration = 0;
  const videoPosition = 0;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const videoURL = require('../../../assets/veo.mp4');
  const player = useVideoPlayer(videoURL, _player => {
    _player.play();
    _player.loop = true;
  });

  if (!mountVideo) return null;

  return (
    <View style={styles.videoWrap}>
      <VideoView
        ref={r => {
          videoRef.current = r;
        }}
        player={player}
        style={styles.video}
        resizeMode="contain"
        controls
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, !paused && styles.btnDisabled]}
          onPress={() => onPausedChange(false)}
          disabled={!paused}
          activeOpacity={0.8}>
          <Text style={styles.btnTxt}>Play Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, paused && styles.btnDisabled]}
          onPress={() => onPausedChange(true)}
          disabled={paused}
          activeOpacity={0.8}>
          <Text style={styles.btnTxt}>Pause Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            videoRef.current?.seek(0);
            onPausedChange(false);
          }}
          activeOpacity={0.8}>
          <Text style={styles.btnTxt}>Restart</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.small}>
        {mmssss(Math.floor(videoPosition * 1000))} / {mmssss(Math.floor(videoDuration * 1000))}
      </Text>
      <Text style={styles.note}>
        Warning: Keeping video active may conflict with recording sessions on iOS if audio sessions
        are not configured correctly.
      </Text>
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    videoWrap: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: '#000000',
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    video: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginVertical: 10,
      paddingHorizontal: 12,
    },
    btn: {
      backgroundColor: theme.mode === 'dark' ? '#1E293B' : '#E2E8F0',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    btnDisabled: {
      opacity: 0.5,
    },
    btnTxt: {
      color: theme.text,
      fontSize: 12,
      fontWeight: 'bold',
    },
    small: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
      paddingHorizontal: 12,
      fontWeight: '500',
    },
    note: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 8,
      paddingHorizontal: 12,
      paddingBottom: 12,
      lineHeight: 14,
    },
  });

export default VideoSection;
