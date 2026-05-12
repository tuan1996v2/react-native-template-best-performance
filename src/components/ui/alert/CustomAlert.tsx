import React, { memo } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAlertStore } from './useAlertStore';
import { ms, s, vs } from '@/theme/Responsive';

const CustomAlert = memo(() => {
  const { visible, title, content, buttons } = useAlertStore(state => state.alert);
  const hideAlert = useAlertStore(state => state.hideAlert);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
          <View style={styles.footer}>
            {buttons.map((btn, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  btn.onPress();
                  hideAlert();
                }}
                style={styles.button}>
                <Text style={styles.btnText}>{btn.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: { width: '80%', backgroundColor: '#FFF', borderRadius: ms(16), padding: s(20) },
  title: { fontSize: ms(18), fontWeight: 'bold', textAlign: 'center' },
  content: { marginTop: vs(10), textAlign: 'center', color: '#666' },
  footer: { flexDirection: 'row', marginTop: vs(20), justifyContent: 'flex-end' },
  button: { marginLeft: s(15) },
  btnText: { color: '#007AFF', fontWeight: '700' },
});

export default CustomAlert;
