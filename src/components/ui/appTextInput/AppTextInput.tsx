import IconClose from '@/assets/icon/IconClose';
import IconEyeOffOutline from '@/assets/icon/IconEyeOffOutline';
import IconEyeOutline from '@/assets/icon/IconEyeOutline';
import { fs, s, vs } from '@/theme/Responsive';
import React, { memo, useState, forwardRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import { useStyles } from '@/theme/useStyles';
import { AppTheme } from '@/theme/Colors';

// 1. Tách Label ra thành Component độc lập và memoize để nó KHÔNG BAO GIỜ render lại
// khi user gõ phím vào ô input bên dưới.
interface AppInputLabelProps {
  label: string;
  required?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  inline?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any;
}

const AppInputLabel = memo(
  ({ label, required, labelStyle, inline, styles }: AppInputLabelProps) => (
    <View style={[styles.labelContainer, inline && styles.inlineLabel]}>
      <Text style={[styles.labelText, labelStyle]}>{label}</Text>
      {required ? <Text style={styles.colorRed}> *</Text> : null}
    </View>
  ),
);

export interface AppInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string; // Gom errorMessage và error thành 1 prop duy nhất
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactElement | null;
  rightIcon?: React.ReactElement | null;
  onPressRightIcon?: () => void;
  rightComponent?: React.ReactElement;
  onClear?: () => void; // Thay vì tự xử lý logic xóa bên trong, hãy để Cha quyết định
}

const AppTextInput = forwardRef<TextInput, AppInputProps>((props, ref) => {
  const {
    label,
    required,
    error,
    secureTextEntry,
    leftIcon,
    rightIcon,
    rightComponent,
    onPressRightIcon,
    onClear,
    containerStyle,
    inputStyle,
    inputTextStyle,
    labelStyle,
    editable = true,
    value,
    ...rest
  } = props;

  const styles = useStyles(createStyles);

  // 2. CHỈ giữ lại state cho những thứ thuộc về UI nội bộ (như ẩn/hiện password)
  const [showPassword, setShowPassword] = useState(false);

  // 3. useCallback để đảm bảo function reference không thay đổi giữa các lần render
  const togglePassword = useCallback(() => setShowPassword(prev => !prev), []);

  const disabled = !editable;
  const isShowClearButton = Boolean(value && !disabled && onClear && !secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppInputLabel
          label={label}
          required={required}
          labelStyle={[styles.labelText, labelStyle]}
          styles={styles}
        />
      )}

      <View
        style={[
          styles.inputWrapper,
          disabled && styles.disabledWrapper,
          error && styles.errorWrapper,
          inputStyle,
        ]}>
        {leftIcon}

        <TextInput
          ref={ref}
          value={value}
          editable={editable}
          // 4. Tắt allowFontScaling để Layout không bị nát khi user chỉnh chữ to trong Setting máy
          allowFontScaling={false}
          secureTextEntry={secureTextEntry && !showPassword}
          placeholderTextColor={'#999'}
          style={[styles.input, leftIcon && styles.pl0, inputTextStyle]}
          {...rest}
        />

        {/* 5. Logic render Icon tối ưu, không inline function */}
        {secureTextEntry ? (
          <TouchableOpacity onPress={togglePassword} style={styles.iconContainer}>
            {showPassword ? <IconEyeOutline /> : <IconEyeOffOutline />}
          </TouchableOpacity>
        ) : isShowClearButton ? (
          <TouchableOpacity onPress={onClear} style={styles.iconContainer}>
            <IconClose width={16} />
          </TouchableOpacity>
        ) : null}

        {rightIcon && (
          <TouchableOpacity onPress={onPressRightIcon} style={styles.iconContainer}>
            {rightIcon}
          </TouchableOpacity>
        )}

        {rightComponent}
      </View>

      {/* 6. Không dùng object inline cho style */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

// 7. custom areEqual (Vũ khí bí mật cho Form lớn)
// Bỏ qua việc so sánh các props là function (onChangeText, onBlur) vì cha thường truyền inline function.
// Chỉ render lại khi value, error, hoặc các state UI quan trọng thực sự đổi.
const arePropsEqual = (prevProps: AppInputProps, nextProps: AppInputProps) =>
  prevProps.value === nextProps.value &&
  prevProps.error === nextProps.error &&
  prevProps.editable === nextProps.editable &&
  prevProps.secureTextEntry === nextProps.secureTextEntry;

const createStyles = (theme: AppTheme) => ({
  container: {
    marginBottom: vs(16),
  },
  // --- Label styles ---
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  inlineLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    marginRight: s(8),
  },
  labelText: {
    fontSize: fs(14),
    fontWeight: '600',
    color: theme.text,
  },
  colorRed: {
    color: theme.error,
    fontSize: fs(14),
    fontWeight: '600',
  },
  // --- Input styles ---
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: vs(48),
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: s(8),
    paddingHorizontal: s(12),
    backgroundColor: theme.inputBg,
  },
  disabledWrapper: {
    opacity: 0.6,
  },
  errorWrapper: {
    borderColor: theme.error,
  },
  input: {
    flex: 1,
    fontSize: fs(14),
    color: theme.text,
    paddingVertical: 0, // Quan trọng trên Android để chữ không bị lệch
  },
  pl0: {
    paddingLeft: s(8),
  },
  iconContainer: {
    padding: s(4),
    marginLeft: s(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme.error,
    fontSize: fs(12),
    marginTop: vs(4),
  },
});

export default memo(AppTextInput, arePropsEqual);
