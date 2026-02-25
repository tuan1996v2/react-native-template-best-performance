import { StyleSheet } from 'react-native';
import { s, vs, fs } from '../../theme/Responsive';
import { AppTheme } from '../../theme/Colors';

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
  },
  grabber: {
    width: s(40),
    height: vs(5),
    backgroundColor: '#ccc',
    borderRadius: s(3),
    alignSelf: 'center',
    marginTop: vs(10),
  },
  content: {
    padding: s(20),
    alignItems: 'center',
  },
  title: {
    fontSize: fs(22),
    fontWeight: '900',
    color: theme.text,
    marginVertical: vs(15),
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    padding: s(20),
    backgroundColor: theme.inputBg || '#f8f9fa',
    borderRadius: s(15),
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: vs(30),
  },
  description: {
    fontSize: fs(16),
    lineHeight: fs(24),
    color: theme.text,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    paddingHorizontal: s(20),
  },
  button: {
    width: '100%',
  },
});

export default createStyles;
