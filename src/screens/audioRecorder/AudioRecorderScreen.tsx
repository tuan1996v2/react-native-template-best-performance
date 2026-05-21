import React, { useState, memo, useCallback } from 'react';
import AppScreen from '@/components/ui/appScreen/AppScreen';
import { HomeScreen, ScreenKey } from './screens/HomeScreen';
import { CompatibilityScreen } from './screens/CompatibilityScreen';
import { RapidSwitchScreen } from './screens/RapidSwitchScreen';
import { SoundHookScreen } from './screens/SoundHookScreen';
import { SoundHookStatesScreen } from './screens/SoundHookStatesScreen';
import { SoundScreen } from './screens/SoundScreen';

const AudioRecorderScreen = () => {
  const [screen, setScreen] = useState<ScreenKey | 'Home'>('Home');
  const goBack = useCallback(() => {
    setScreen('Home');
  }, []);
  return (
    <AppScreen edges={['top', 'bottom']}>
      {screen === 'Home' && <HomeScreen onNavigate={setScreen} />}
      {screen === 'SoundHook' && <SoundHookScreen onBack={goBack} />}
      {screen === 'SoundHookStates' && <SoundHookStatesScreen onBack={goBack} />}
      {screen === 'SoundDirect' && <SoundScreen onBack={goBack} />}
      {screen === 'RapidSwitch' && <RapidSwitchScreen onBack={goBack} />}
      {screen === 'Compatibility' && <CompatibilityScreen onBack={goBack} />}
    </AppScreen>
  );
};

export default memo(AudioRecorderScreen);
