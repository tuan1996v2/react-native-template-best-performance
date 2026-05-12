import { StyleSheet } from 'react-native';
import { vs, fs } from '../../theme/Responsive';
import { AppTheme } from '../../theme/Colors';
import { SCREEN_PADDING, SONG_HEIGHT } from './constants';

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      height: '100%',
    },
    actionContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    actionText: {
      color: theme.white,
      fontWeight: '600',
    },
    w100: {
      width: '100%',
    },

    listContainer: {
      backgroundColor: theme.background,
      flex: 1,
    },
    flatListContent: {
      paddingHorizontal: SCREEN_PADDING,
    },
    // SongItem styles
    itemContainer: {
      flexDirection: 'row',
      backgroundColor: theme.background,
    },
    imageContainer: {
      width: '20%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: '3%',
      paddingVertical: '3%',
    },
    image: {
      height: vs(SONG_HEIGHT - 20),
      width: '100%',
    },
    descriptionContainer: {
      width: '80%',
      justifyContent: 'space-evenly',
    },
    title: {
      fontSize: fs(18),
      fontWeight: 'bold',
      color: theme.text,
    },
    singer: {
      color: theme.textSecondary,
      fontSize: fs(14),
    },
    swipeViewContainer: {
      paddingVertical: 20,
    },
  });

export default createStyles;
