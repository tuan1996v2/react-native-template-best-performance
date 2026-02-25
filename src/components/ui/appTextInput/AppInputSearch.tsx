import React, { memo, forwardRef, useCallback } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { ms, s } from '../../../theme/Responsive';

// 1. Kế thừa TextInputProps để nhận mọi props mặc định của RN mà không cần khai báo lại
export interface AppInputSearchProps extends Omit<TextInputProps, 'onChangeText'> {
  onChangeText: (v: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  stroke?: string;
  fill?: string;
  isLoading?: boolean;
  right?: boolean;
  width?: number | string;
  showIconRemove?: boolean;
}

// 2. Khai báo hàm rỗng ở NGOÀI component để RAM chỉ cấp phát đúng 1 lần
const NOOP = () => {};

const AppInputSearch = forwardRef<TextInput, AppInputSearchProps>((props, ref) => {
  const {
    onChangeText,
    placeholder = 'Tìm kiếm sản phẩm',
    value,
    onPressIn = NOOP,
    containerStyle,
    inputStyle,
    editable = true,
    width,
    right = false,
    stroke,
    fill,
    onSubmitEditing,
    showIconRemove = true,
    keyboardType = 'default',
    ...rest
  } = props;

  // 3. Dùng useCallback để tránh tạo mới function khi render
  const handleClearText = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  const SearchIcon = <IconSearch stroke={stroke} fill={fill} />;
  const hasValue = Boolean(value && value.length > 0);

  return (
    <View style={[styles.container, width ? { width } : undefined, containerStyle]}>
      {/* Icon Trái */}
      {!right && SearchIcon}

      {/* 4. Chỉ dùng duy nhất 1 TextInput, xử lý UI bằng Flexbox */}
      <TextInput
        ref={ref}
        value={value} // BẮT BUỘC dùng value cho Search để component cha kiểm soát 100%
        keyboardType={keyboardType}
        maxLength={255}
        onPressIn={onPressIn}
        placeholder={placeholder}
        placeholderTextColor="#949494"
        onChangeText={onChangeText}
        editable={editable}
        onSubmitEditing={onSubmitEditing}
        allowFontScaling={false}
        style={[styles.input, !right && styles.inputLeftIcon, inputStyle]}
        {...rest}
      />

      {/* Nút Xóa (Chỉ hiện khi có chữ và không ở mode Right) */}
      {showIconRemove && hasValue && !right ? (
        <TouchableOpacity
          style={styles.buttonRemove}
          onPress={handleClearText}
          activeOpacity={0.7}
          // Tăng vùng bấm (hitSlop) để user dễ chạm vào dấu X nhỏ
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} 
        >
          <IconClose width={16} height={16} fill="#949494" />
        </TouchableOpacity>
      ) : null}

      {/* Icon Phải */}
      {right && (
        <TouchableOpacity onPress={onSubmitEditing} activeOpacity={0.7} style={styles.rightIcon}>
          {SearchIcon}
        </TouchableOpacity>
      )}
    </View>
  );
});

// 5. Ngăn chặn Render thừa mứa khi cuộn danh sách
const arePropsEqual = (prev: AppInputSearchProps, next: AppInputSearchProps) => prev.value === next.value && prev.editable === next.editable;

export default memo(AppInputSearch, arePropsEqual);

// 6. Đưa tất cả style tĩnh ra ngoài
const styles = StyleSheet.create({
  container: {
    height: ms(40), // Chuẩn hóa chiều cao (Apple khuyên dùng tối thiểu 44 cho touch target, 40 là hợp lý cho ô input)
    borderRadius: ms(32),
    paddingHorizontal: s(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#BEBEBE',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontWeight: '500',
    color: '#333333',
    fontSize: ms(14),
    paddingVertical: 0, // Fix lệch chữ Android
    height: '100%',
  },
  inputLeftIcon: {
    marginLeft: s(8),
  },
  buttonRemove: {
    padding: s(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    paddingLeft: s(8),
  },
});