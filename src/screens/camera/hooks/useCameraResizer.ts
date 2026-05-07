import { useEffect } from 'react';
import { useFrameOutput } from 'react-native-vision-camera';
import { useResizer } from 'react-native-vision-camera-resizer';

export function useCameraResizer() {
  const { resizer, error } = useResizer({
    width: 192,
    height: 192,
    channelOrder: 'rgb',
    dataType: 'float32',
    scaleMode: 'cover',
    pixelLayout: 'interleaved',
  });

  useEffect(() => {
    if (error != null) console.error('Failed to prepare Resizer!', error);
  }, [error]);

  const frameOutput = useFrameOutput({
    pixelFormat: 'yuv',
    onFrame(frame) {
      'worklet';
      if (resizer != null) {
        const start = performance.now();
        const resized = resizer.resize(frame);
        const end = performance.now();
        const time = `${(end - start).toFixed(2)}ms`;
        console.log(
          `Resized ${frame.width}x${frame.height} ${frame.pixelFormat} -> ${resized.width}x${resized.height} rgb-float32 in ${time}`,
        );
        const buffer = resized.getPixelBuffer();
        const view = new Float32Array(buffer);
        for (let i = 0; i < 3 * 10; i += 3) {
          console.log(`  Pixel [${i}] = [${view[i]}, ${view[i + 1]}, ${view[i + 2]}]`);
        }
        resized.dispose();
      } else {
        console.log("Resizer isn't ready yet...");
      }
      frame.dispose();
    },
  });

  return frameOutput;
}
