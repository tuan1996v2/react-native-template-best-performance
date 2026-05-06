import { s } from '@/theme/Responsive';
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const IconArrowUp = (props: SvgProps) => (
  <Svg
    width={props.width || s(24)}
    height={props.height || s(24)}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Path
      d="M12 19V5"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 12L12 5L19 12"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(IconArrowUp);
