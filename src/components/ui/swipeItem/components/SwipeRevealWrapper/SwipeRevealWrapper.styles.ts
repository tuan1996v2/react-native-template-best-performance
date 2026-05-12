import { StyleSheet } from 'react-native';

const createStyles = () =>
  StyleSheet.create({
    rightContainer: {
      position: 'absolute',
      right: 0,
      height: '100%',
    },
    leftRevealedViewContainer: {
      position: 'absolute',
      height: '100%',
    },
    w100: {
      width: '100%',
    },
    zindex: {
      zIndex: 100,
      elevation: 100,
    },
  });

export default createStyles;
