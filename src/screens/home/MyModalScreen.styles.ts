import { StyleSheet } from 'react-native';
import { s, vs, fs } from '../../theme/Responsive';

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderTopLeftRadius: s(40),
      borderTopRightRadius: s(40),
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
    },
    grabber: {
      width: s(48),
      height: vs(6),
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: s(3),
      alignSelf: 'center',
      marginTop: vs(12),
    },
    content: {
      paddingHorizontal: s(24),
      paddingBottom: vs(40),
      alignItems: 'center',
    },
    iconWrapper: {
      width: s(100),
      height: s(100),
      borderRadius: s(35),
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: vs(30),
      marginBottom: vs(20),
      borderWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.2)',
    },
    title: {
      fontSize: fs(28),
      fontWeight: '900',
      color: '#1E293B',
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: fs(14),
      fontWeight: '600',
      color: '#6366F1',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: vs(8),
      marginTop: vs(10),
    },
    card: {
      width: '100%',
      padding: s(24),
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderRadius: s(30),
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.8)',
      marginTop: vs(20),
      marginBottom: vs(40),
      // Glass shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
      elevation: 5,
    },
    description: {
      fontSize: fs(16),
      lineHeight: fs(26),
      color: '#475569',
      textAlign: 'center',
      fontWeight: '500',
    },
    buttonGroup: {
      width: '100%',
      gap: vs(16),
    },
    primaryButton: {
      height: vs(56),
      borderRadius: s(18),
    },
    secondaryButton: {
      height: vs(56),
      borderRadius: s(18),
      backgroundColor: 'transparent',
    },
    secondaryButtonText: {
      color: '#64748B',
    },
  });

export default createStyles;
