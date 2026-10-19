#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Scaffolding Screen Generator for react-native-template-best-performance
 * Usage: yarn gen:screen <ScreenName>
 * Example: yarn gen:screen OrderDetail
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Helpers for string case conversion
const toPascalCase = str =>
  str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, c => c.toUpperCase());

const toCamelCase = str => {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toSnakeCase = str =>
  str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[-\s]+/g, '_');

const formatDisplayName = str => str.replace(/([A-Z])/g, ' $1').trim();

const ROOT_DIR = path.resolve(__dirname, '..');

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans.trim());
    }),
  );
}

async function main() {
  let rawName = process.argv[2];

  if (!rawName) {
    rawName = await askQuestion('👉 Nhập tên màn hình (vd: OrderDetail, UserProfile, Voucher): ');
  }

  if (!rawName) {
    console.error('❌ Tên màn hình không được để trống!');
    process.exit(1);
  }

  // Normalize: Strip trailing 'Screen' if user provided it
  const cleanName = rawName.replace(/Screen$/i, '').trim();
  const pascalName = toPascalCase(cleanName);
  const screenName = `${pascalName}Screen`;
  const folderName = toCamelCase(cleanName);
  const snakeKey = toSnakeCase(cleanName);
  const displayName = formatDisplayName(pascalName);

  console.log(`\n🚀 Đang khởi tạo màn hình mới: ${screenName}...`);

  const screenDir = path.join(ROOT_DIR, 'src', 'screens', folderName);
  const screenFilePath = path.join(screenDir, `${screenName}.tsx`);
  const stylesFilePath = path.join(screenDir, `${screenName}.styles.ts`);

  // Check if directory or file already exists
  if (fs.existsSync(screenFilePath)) {
    console.error(`❌ Màn hình ${screenName} đã tồn tại tại: ${screenFilePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(screenDir)) {
    fs.mkdirSync(screenDir, { recursive: true });
  }

  // 1. Tạo file Styles (chuẩn AppTheme, s, vs, ms, fs)
  const stylesContent = `import { StyleSheet } from 'react-native';
import { AppTheme } from '@/theme/Colors';
import { s, vs, ms, fs } from '@/theme/Responsive';

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: s(16),
      paddingVertical: vs(16),
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: ms(16),
      padding: ms(20),
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: vs(4) },
      shadowOpacity: 0.05,
      shadowRadius: ms(8),
      elevation: 3,
      marginBottom: vs(16),
    },
    title: {
      fontSize: fs(20),
      fontWeight: '700',
      color: theme.text,
      marginBottom: vs(8),
    },
    description: {
      fontSize: fs(14),
      color: theme.textSecondary,
      lineHeight: fs(20),
    },
    actionButton: {
      width: '100%',
      height: vs(48),
      marginTop: vs(12),
    },
    backButtonText: {
      color: theme.text,
    },
  });
`;

  fs.writeFileSync(stylesFilePath, stylesContent, 'utf8');
  console.log(`  ✅ Đã tạo: src/screens/${folderName}/${screenName}.styles.ts`);

  // 2. Tạo file Component (chuẩn memo, useStyles, useTranslation, useRenderLog, zero inline style)
  const screenContent = `import React, { memo, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useStyles } from '@/theme/useStyles';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeTokens } from '@/theme/Colors';
import useRenderLog from '@/hooks/useRenderLog';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import AppButton from '@/components/ui/appButton/AppButton';
import { toast } from '@/components/ui/alert/useAlertStore';
import NavigationService from '@/navigation/NavigationService';
import { createStyles } from './${screenName}.styles';

const ${screenName}: React.FC = () => {
  useRenderLog('${screenName}');
  const styles = useStyles(createStyles);
  const { t } = useTranslation();
  const mode = useThemeStore(state => state.mode);
  const currentTheme = ThemeTokens[mode] || ThemeTokens.light;

  const handleAction = useCallback(() => {
    toast.success('Hành động thành công trên ${displayName}!');
  }, []);

  const handleGoBack = useCallback(() => {
    NavigationService.back();
  }, []);

  return (
    <AppScreen isPaddingBottom style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('${snakeKey}.title', { defaultValue: '${displayName}' })}</Text>
          <Text style={styles.description}>
            {t('${snakeKey}.description', {
              defaultValue: 'Màn hình được sinh tự động theo chuẩn hiệu năng cao Best Performance.',
            })}
          </Text>
        </View>

        <AppButton
          title="Bấm thử nghiệm"
          onPress={handleAction}
          color={currentTheme.primary}
          style={styles.actionButton}
        />

        <AppButton
          title="Quay lại"
          onPress={handleGoBack}
          color={currentTheme.card}
          textStyle={styles.backButtonText}
          style={styles.actionButton}
        />
      </View>
    </AppScreen>
  );
};

export default memo(${screenName});
`;

  fs.writeFileSync(screenFilePath, screenContent, 'utf8');
  console.log(`  ✅ Đã tạo: src/screens/${folderName}/${screenName}.tsx`);

  // 3. Đăng ký vào AppNavigation.tsx (Static API v8)
  const navPath = path.join(ROOT_DIR, 'src', 'navigation', 'AppNavigation.tsx');
  if (fs.existsSync(navPath)) {
    let navContent = fs.readFileSync(navPath, 'utf8');

    // Add import statement
    const importStatement = `import ${screenName} from '../screens/${folderName}/${screenName}';\n`;
    if (!navContent.includes(importStatement)) {
      const lastImportIndex = navContent.lastIndexOf('import ');
      const endOfLastImport = navContent.indexOf('\n', lastImportIndex);
      navContent =
        navContent.slice(0, endOfLastImport + 1) +
        importStatement +
        navContent.slice(endOfLastImport + 1);
    }

    // Add route to MainStack
    const mainStackTarget = 'const MainStack = {';
    if (navContent.includes(mainStackTarget) && !navContent.includes(`${screenName}: {`)) {
      const routeConfig = `  ${screenName}: {\n    screen: ${screenName},\n    options: { title: '${displayName}', headerShown: true },\n  },\n`;
      navContent = navContent.replace(mainStackTarget, `${mainStackTarget}\n${routeConfig}`);
      fs.writeFileSync(navPath, navContent, 'utf8');
      console.log(`  ✅ Đã đăng ký route vào: src/navigation/AppNavigation.tsx`);
    }
  }

  // 4. Inject key vào vi.json & en.json
  const viPath = path.join(ROOT_DIR, 'src', 'i18n', 'locales', 'vi.json');
  const enPath = path.join(ROOT_DIR, 'src', 'i18n', 'locales', 'en.json');

  const updateLocaleJson = (filePath, langTitle, langDesc) => {
    if (fs.existsSync(filePath)) {
      try {
        const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!json[snakeKey]) {
          json[snakeKey] = {
            title: langTitle,
            description: langDesc,
          };
          fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
          console.log(`  ✅ Đã thêm bản dịch vào: ${path.relative(ROOT_DIR, filePath)}`);
        }
      } catch (e) {
        console.warn(`  ⚠️ Không thể cập nhật i18n file ${filePath}: ${e.message}`);
      }
    }
  };

  updateLocaleJson(
    viPath,
    displayName,
    'Màn hình được sinh tự động theo chuẩn hiệu năng cao Best Performance.',
  );
  updateLocaleJson(
    enPath,
    displayName,
    'Screen automatically generated following Best Performance guidelines.',
  );

  // 5. Tự động format code theo Prettier chuẩn dự án
  try {
    const { execSync } = require('child_process');
    execSync(`npx prettier --write "${screenFilePath}" "${stylesFilePath}"`, { stdio: 'ignore' });
    console.log('  ✨ Đã tự động định dạng mã nguồn chuẩn Prettier');
  } catch {
    // Bỏ qua nếu prettier không chạy được
  }

  console.log(`\n🎉 Hoàn thành sinh màn hình ${screenName}!`);
  console.log(`💡 Điều hướng tới màn hình:`);
  console.log(`   NavigationService.navigate('${screenName}');\n`);
}

main().catch(err => {
  console.error('❌ Lỗi generator:', err);
  process.exit(1);
});
