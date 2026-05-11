import { fs, s, vs } from '@/theme/Responsive';
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Camera Preview
  cameraContainer: {
    backgroundColor: '#000',
    borderRadius: s(24),
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
    width: '92%',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: s(250),
    height: s(250),
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.5)',
    borderRadius: s(24),
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: vs(2),
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: s(10),
    elevation: 5,
  },
  // Permission Screen
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(20),
  },
  permissionText: {
    fontSize: fs(24),
    fontWeight: 'bold',
    marginBottom: vs(12),
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: fs(16),
    color: '#666',
    marginBottom: vs(24),
    textAlign: 'center',
  },
  // Modern Minimal Header
  header: {
    backgroundColor: '#4F46E5', // Indigo-600
    paddingHorizontal: s(24),
    paddingVertical: vs(20),
    borderBottomLeftRadius: s(24),
    borderBottomRightRadius: s(24),
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: vs(4) },
    shadowOpacity: 0.2,
    shadowRadius: s(12),
    elevation: 8,
  },
  headerTitle: {
    fontSize: fs(20),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fs(13),
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginTop: vs(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    marginRight: s(6),
  },
  statusDotScanning: {
    backgroundColor: '#34C759',
  },
  statusDotReady: {
    backgroundColor: '#EF4444',
  },
  statusTextHeader: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: fs(13),
    fontWeight: '600',
  },
  // Controls
  controls: {
    padding: s(16),
    gap: vs(12),
  },
  button: {
    backgroundColor: '#007AFF',
    padding: vs(16),
    borderRadius: s(12),
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: fs(16),
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#FF3B30',
    padding: vs(16),
    borderRadius: s(12),
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: 'white',
    fontSize: fs(16),
    fontWeight: '600',
  },
  // Result
  result: {
    margin: s(16),
    padding: s(16),
    backgroundColor: 'white',
    borderRadius: s(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.1,
    shadowRadius: s(4),
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  resultTitle: {
    fontSize: fs(18),
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    color: '#007AFF',
    fontSize: fs(14),
    fontWeight: '600',
  },
  resultContent: {
    gap: vs(8),
  },
  resultRow: {
    flexDirection: 'row',
    paddingVertical: vs(8),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: fs(14),
    fontWeight: '600',
    color: '#666',
    width: s(60),
  },
  resultValue: {
    fontSize: fs(14),
    color: '#333',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  // History
  history: {
    margin: s(16),
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: s(12),
    padding: s(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: vs(2) },
    shadowOpacity: 0.1,
    shadowRadius: s(4),
    elevation: 3,
    maxHeight: vs(200),
  },
  historyTitle: {
    fontSize: fs(16),
    fontWeight: 'bold',
    marginBottom: vs(12),
    color: '#333',
  },
  historyList: {
    maxHeight: vs(150),
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: vs(8),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyType: {
    fontSize: fs(12),
    fontWeight: '600',
    color: '#007AFF',
    width: s(100),
  },
  historyData: {
    fontSize: fs(12),
    color: '#666',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  // Footer
  footer: {
    padding: s(16),
    alignItems: 'center',
  },
  footerText: {
    fontSize: fs(14),
    color: '#666',
    textAlign: 'center',
  },
});
