import React, { memo, useMemo } from 'react';
import { StyleSheet, StatusBar, StatusBarStyle, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface AppScreenProps {
    children: React.ReactNode;
    edges?: Edge[];
    style?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    statusBarStyle?: StatusBarStyle;
}

const AppScreen = memo(({
    children,
    edges = ['top', 'bottom'],
    style,
    backgroundColor = '#FFFFFF',
    statusBarStyle = 'dark-content',
}: AppScreenProps) => {
    // Memoize style array — tránh tạo mới mỗi render
    const containerStyle = useMemo(
        () => [styles.container, { backgroundColor }, style],
        [backgroundColor, style],
    );

    return (
        <SafeAreaView
            edges={edges}
            style={containerStyle}
            mode="padding"
        >
            <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
            {children}
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AppScreen;