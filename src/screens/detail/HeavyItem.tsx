import React, { memo, useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import AppImage from '@/components/ui/appImage/AppImage';
import AppPress from '@/components/ui/appPress/AppPress';
import type { SocialPost } from './DetailScreen';
import createStyles from './HeavyItem.styles';
import { useStyles } from '@/theme/useStyles';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import {
  IconVerified,
  IconMore,
  IconHeart,
  IconComment,
  IconShare,
  IconBookmark,
} from '@/assets/icon';

// ─── FAKE API: giả lập gọi server mất 2 giây ─────────────────
const fakeToggleLikeAPI = (postId: string, newLiked: boolean): Promise<boolean> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(newLiked);
    }, 2000);
  });

// ─── HELPER: tạo thumbnail URL ────────────────────────────────
export const getThumbnail = (uri: string) => ({
  uri: uri.replace('/800/', '/80/').replace('/600/', '/60/'),
});

// ─── ATOM 1: POST HEADER (Avatar & User Info) ─────────────────
const PostHeader = memo(
  ({
    userAvatar,
    userName,
    userHandle,
    timeAgo,
    isVerified,
  }: {
    userAvatar: string;
    userName: string;
    userHandle: string;
    timeAgo: string;
    isVerified: boolean;
  }) => {
    const styles = useStyles(createStyles);
    const mode = useThemeStore(state => state.mode);
    const theme = ThemeTokens[mode];

    return (
      <View style={styles.header}>
        <View style={styles.avatarRing}>
          <AppImage source={{ uri: userAvatar }} style={styles.avatar} />
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
            </Text>
            {isVerified && (
              <IconVerified
                fill={theme.verified}
                width={14}
                height={14}
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <Text style={styles.handleTime}>
            {userHandle} · {timeAgo}
          </Text>
        </View>
        <IconMore fill={theme.textMuted} width={20} height={20} />
      </View>
    );
  },
);

// ─── ATOM 2: POST CONTENT (Text) ──────────────────────────────
const PostContent = memo(({ content }: { content: string }) => {
  const styles = useStyles(createStyles);
  return <Text style={styles.contentText}>{content}</Text>;
});

// ─── ATOM 3: FACEBOOK-STYLE IMAGE GRID ────────────────────────
const MAX_VISIBLE = 4;

const ImageGrid = memo(
  ({
    images,
    onImagePress,
  }: {
    images: string[];
    onImagePress: (images: string[], index: number) => void;
  }) => {
    const styles = useStyles(createStyles);
    const count = images.length;
    if (count === 0) return null;

    if (count === 1) {
      return (
        <View style={styles.imageContainer}>
          <AppPress onPress={() => onImagePress(images, 0)}>
            <AppImage
              thumbnailSource={getThumbnail(images[0])}
              source={{ uri: images[0] }}
              style={styles.singleImage}
            />
          </AppPress>
        </View>
      );
    }

    // 2-3-4 images logic giữ nguyên style nhưng dùng AppPress cho chuẩn
    const renderItem = (index: number, customStyle?: StyleProp<ViewStyle>) => (
      <AppPress style={customStyle || styles.imageFill} onPress={() => onImagePress(images, index)}>
        <AppImage
          thumbnailSource={getThumbnail(images[index])}
          source={{ uri: images[index] }}
          style={styles.imageFill}
        />
      </AppPress>
    );

    if (count === 2) {
      return (
        <View style={styles.imageContainer}>
          <View style={styles.twoImagesRow}>
            {renderItem(0, styles.twoImagesItem)}
            <View style={styles.twoImagesGap} />
            {renderItem(1, styles.twoImagesItem)}
          </View>
        </View>
      );
    }

    if (count === 3) {
      return (
        <View style={styles.imageContainer}>
          <View style={styles.threeImagesContainer}>
            {renderItem(0, styles.threeImagesLeft)}
            <View style={styles.threeImagesRight}>
              {renderItem(1, styles.threeImagesRightTop)}
              <View style={styles.threeImagesRightGap} />
              {renderItem(2, styles.threeImagesRightBottom)}
            </View>
          </View>
        </View>
      );
    }

    const remaining = count - MAX_VISIBLE;
    return (
      <View style={styles.imageContainer}>
        <View style={styles.fourImagesContainer}>
          <View style={styles.fourImagesTopRow}>
            {renderItem(0, styles.fourImagesItem)}
            <View style={styles.fourImagesGap} />
            {renderItem(1, styles.fourImagesItem)}
          </View>
          <View style={styles.fourImagesBottomRow}>
            {renderItem(2, styles.fourImagesItem)}
            <View style={styles.fourImagesGap} />
            <View style={styles.fourImagesItem}>
              {renderItem(3, styles.imageFill)}
              {remaining > 0 && (
                <View style={styles.remainingOverlay} pointerEvents="none">
                  <Text style={styles.remainingText}>+{remaining}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  },
);

// ─── ATOM 4: LIKE SUMMARY ─────────────────────────────────────
const PostLikeSummary = memo(
  ({ liked, likeCount, lastName }: { liked: boolean; likeCount: number; lastName: string }) => {
    const styles = useStyles(createStyles);
    return (
      <View style={styles.likeSummary}>
        <View style={styles.likeDots}>
          <View style={styles.likeDotRed} />
          <View style={styles.likeDotAccent} />
          <View style={styles.likeDotYellow} />
        </View>
        <Text style={styles.likeSummaryText}>
          {liked ? 'Bạn' : lastName} và{' '}
          <Text style={styles.likeSummaryBold}>{likeCount.toLocaleString()}</Text> người khác
        </Text>
      </View>
    );
  },
);

// ─── ATOM 5: ACTION BAR ───────────────────────────────────────
const PostActionBar = memo(
  ({
    liked,
    likeCount,
    comments,
    shares,
    onLikePress,
  }: {
    liked: boolean;
    likeCount: number;
    comments: number;
    shares: number;
    onLikePress: () => void;
  }) => {
    const styles = useStyles(createStyles);
    const mode = useThemeStore(state => state.mode);
    const theme = ThemeTokens[mode];

    return (
      <View style={styles.actionBar}>
        <AppPress onPress={onLikePress} style={[styles.actionBtn, liked && styles.actionBtnLiked]}>
          <IconHeart liked={liked} fill={theme.liked} width={20} height={20} />
          <Text style={[styles.actionLabel, liked && styles.actionLabelLiked]}>{likeCount}</Text>
        </AppPress>

        <AppPress style={styles.actionBtn}>
          <IconComment fill={theme.textMuted} width={20} height={20} />
          <Text style={styles.actionLabel}>{comments}</Text>
        </AppPress>

        <AppPress style={styles.actionBtn}>
          <IconShare fill={theme.textMuted} width={20} height={20} />
          <Text style={styles.actionLabel}>{shares}</Text>
        </AppPress>

        <View style={styles.actionSpacer} />

        <AppPress style={styles.bookmarkBtn}>
          <IconBookmark fill={theme.textMuted} width={20} height={20} />
        </AppPress>
      </View>
    );
  },
);

// ─── MAIN COMPONENT: SOCIAL POST CARD ─────────────────────────
interface SocialPostCardProps {
  item: SocialPost;
  onImagePress: (images: string[], index: number) => void;
}

const SocialPostCard = ({ item, onImagePress }: SocialPostCardProps) => {
  const styles = useStyles(createStyles);
  const [likeState, setLikeState] = useState({
    liked: item.isLiked,
    count: item.likes,
  });

  // 🚀 TỐI ƯU CỐT LÕI: RESET STATE TRONG RENDER (Recycling Fix)
  const prevId = useRef(item.id);
  if (prevId.current !== item.id) {
    prevId.current = item.id;
    setLikeState({ liked: item.isLiked, count: item.likes });
  }

  const toggleLike = useCallback(async () => {
    const newLiked = !likeState.liked;
    const newCount = likeState.count + (newLiked ? 1 : -1);
    setLikeState({ liked: newLiked, count: newCount });

    const confirmedLiked = await fakeToggleLikeAPI(item.id, newLiked);
    if (confirmedLiked !== newLiked) {
      setLikeState(prev => ({
        liked: confirmedLiked,
        count: prev.count + (confirmedLiked ? 0 : -2),
      }));
    }
  }, [likeState.liked, likeState.count, item.id]);

  const lastName = useMemo(() => item.userName.split(' ').pop() || '', [item.userName]);

  return (
    <View style={styles.card}>
      {/* Các Atom static: KHÔNG re-render khi likeState đổi */}
      <PostHeader
        userAvatar={item.userAvatar}
        userName={item.userName}
        userHandle={item.userHandle}
        timeAgo={item.timeAgo}
        isVerified={item.isVerified}
      />

      <PostContent content={item.content} />

      {item.postImages && item.postImages.length > 0 && (
        <ImageGrid images={item.postImages} onImagePress={onImagePress} />
      )}

      {/* Các Atom dynamic: CHỈ re-render phần này khi nhấn like */}
      <PostLikeSummary liked={likeState.liked} likeCount={likeState.count} lastName={lastName} />

      <PostActionBar
        liked={likeState.liked}
        likeCount={likeState.count}
        comments={item.comments}
        shares={item.shares}
        onLikePress={toggleLike}
      />

      <View style={styles.divider} />
    </View>
  );
};

// Memo cuối cùng cho cả Card, so sánh ổn định ref
export default memo(
  SocialPostCard,
  (prev, next) => prev.item.id === next.item.id && prev.onImagePress === next.onImagePress,
);
