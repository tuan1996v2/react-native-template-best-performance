import { StyleSheet } from 'react-native';
import { s, vs, fs, ms } from '@/theme/Responsive';

export const COLORS = {
  primary: '#4F46E5',
  bg: '#F9FAFB',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  black: '#000000',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: s(20),
    paddingTop: vs(20),
    paddingBottom: vs(16),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: fs(28),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: vs(4),
  },
  subtitle: {
    fontSize: fs(15),
    color: COLORS.textSecondary,
    lineHeight: vs(22),
  },
  row: {
    flexDirection: 'row',
  },
  justifyCenter: {
    justifyContent: 'center',
    paddingHorizontal: s(16),
  },
  scrollContent: {
    paddingBottom: vs(40),
  },
  section: {
    marginTop: vs(24),
    marginHorizontal: s(16),
    backgroundColor: COLORS.white,
    borderRadius: ms(20),
    padding: s(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: vs(16),
  },
  sectionTitle: {
    fontSize: fs(18),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: vs(4),
  },
  sectionDesc: {
    fontSize: fs(13),
    color: COLORS.textSecondary,
  },
  otpWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
  },

  // --- Stripe Style ---
  stripeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stripeSlot: {
    width: s(42),
    height: vs(52),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  stripeSlotFirst: {
    borderTopLeftRadius: ms(8),
    borderBottomLeftRadius: ms(8),
  },
  stripeSlotLast: {
    borderTopRightRadius: ms(8),
    borderBottomRightRadius: ms(8),
  },
  stripeActiveSlot: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 2,
    zIndex: 1,
  },
  stripeChar: {
    fontSize: fs(22),
    fontWeight: '600',
    color: COLORS.text,
  },
  stripeDash: {
    width: s(12),
    height: vs(2),
    backgroundColor: '#D1D5DB',
    marginHorizontal: s(8),
    borderRadius: 1,
  },

  // --- Apple Style ---
  appleSlot: {
    width: s(44),
    height: vs(56),
    borderRadius: ms(12),
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: s(3),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  appleActiveSlot: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  appleChar: {
    fontSize: fs(24),
    fontWeight: '700',
    color: COLORS.text,
  },

  // --- Dashed Style ---
  dashedSlot: {
    width: s(40),
    height: vs(40),
    marginHorizontal: s(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedUnderline: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dashedActiveUnderline: {
    backgroundColor: COLORS.primary,
    height: 2,
  },

  // --- Revolt Style ---
  revoltContainer: {
    flexDirection: 'row',
    gap: s(10),
  },
  revoltSlot: {
    width: s(40),
    height: vs(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: ms(8),
    backgroundColor: '#F9FAFB',
  },
  revoltActiveSlot: {
    borderColor: '#2563EB',
    borderWidth: 2,
    backgroundColor: COLORS.white,
  },
  revoltChar: {
    fontSize: fs(18),
  },
  centerJustify: {
    justifyContent: 'center',
  },
  resendContainer: {
    marginTop: vs(20),
    minHeight: vs(50),
    paddingHorizontal: s(16),
  },
  resendBtn: {
    paddingVertical: vs(8),
    paddingHorizontal: s(16),
  },
  resendText: {
    fontSize: fs(14),
    fontWeight: '600',
    color: COLORS.primary,
  },
  resendDisabled: {
    color: COLORS.textSecondary,
  },

  // --- Caret ---
  caretContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caret: {
    width: s(2),
    height: vs(24),
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },

  footer: {
    marginTop: vs(40),
    alignItems: 'center',
    paddingBottom: vs(20),
  },
  footerText: {
    fontSize: fs(12),
    color: '#9CA3AF',
  },
});
