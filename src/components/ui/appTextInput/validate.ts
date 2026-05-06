// validationSchema.ts
import { z } from 'zod';

// Regex chuẩn cho số điện thoại Việt Nam (10 số, đầu 03, 05, 07, 08, 09)
const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

// Regex cho mật khẩu (Ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .max(50, 'Họ tên không được vượt quá 50 ký tự'),

    email: z.string().min(1, 'Email không được để trống').email('Định dạng email không hợp lệ'),

    phone: z
      .string()
      .min(1, 'Số điện thoại không được để trống')
      .regex(phoneRegex, 'Số điện thoại không hợp lệ'),

    password: z
      .string()
      .min(1, 'Mật khẩu không được để trống')
      .regex(passwordRegex, 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số'),

    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  // Validate xác nhận mật khẩu khớp nhau
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'], // Hiển thị lỗi ở field confirmPassword
  });

// Trích xuất type từ schema để dùng cho TypeScript
export type RegisterFormValues = z.infer<typeof registerSchema>;
