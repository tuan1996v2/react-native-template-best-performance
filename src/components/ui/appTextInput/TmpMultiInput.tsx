// RegisterScreen.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AppTextInput from './AppTextInput'; // File chúng ta đã tối ưu trước đó
import { s, vs } from '@/theme/Responsive';
import { RegisterFormValues, registerSchema } from './validate';
// import { AppText } from '../text/AppText';

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    // Tối ưu hiệu năng: Chỉ validate khi người dùng rời khỏi ô input (blur)
    // Tránh việc chạy Regex nặng trên mỗi ký tự được gõ
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    // Chỉ chạy vào đây khi TOÀN BỘ 20 fields đã hợp lệ
    console.log('Dữ liệu hợp lệ chuẩn sàng để gọi API:', data);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }: { field: any }) => (
          <AppTextInput
            label="Họ và tên"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur} // Quan trọng để trigger mode: 'onBlur'
            error={errors.fullName?.message}
            placeholder="Nhập họ và tên"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }: { field: any }) => (
          <AppTextInput
            label="Email"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
            placeholder="example@gmail.com"
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }: { field: any }) => (
          <AppTextInput
            label="Số điện thoại"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="number-pad"
            maxLength={10}
            error={errors.phone?.message}
            placeholder="0912345678"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }: { field: any }) => (
          <AppTextInput
            label="Mật khẩu"
            required
            secureTextEntry
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            placeholder="Nhập mật khẩu"
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }: { field: any }) => (
          <AppTextInput
            label="Xác nhận mật khẩu"
            required
            secureTextEntry
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
            placeholder="Nhập lại mật khẩu"
          />
        )}
      />

      {/* Nút Đăng ký */}
      <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Đăng Ký Tài Khoản</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: s(16),
    paddingBottom: vs(40),
  },
  btnSubmit: {
    marginTop: vs(24),
    backgroundColor: '#007AFF',
    paddingVertical: vs(14),
    borderRadius: s(8),
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
