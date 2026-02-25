import { useRef } from 'react';

/**
 * 🔍 Hook theo dõi re-render của component.
 * Log ra console mỗi lần component render, kèm số lần render.
 *
 * ⚠️ CHỈ DÙNG KHI DEBUG — xóa khi release!
 *
 * @example
 * const MyComponent = () => {
 *   useRenderLog('MyComponent');
 *   return <View />;
 * };
 */
const useRenderLog = (componentName: string) => {
  if(!__DEV__) return
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(
    `🔄 [RENDER] ${componentName} — lần thứ ${renderCount.current}`,
  );
};

export default useRenderLog;
