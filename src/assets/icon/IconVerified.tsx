import { s } from '@/theme/Responsive';
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const IconVerified = (props: SvgProps) => (
  <Svg
    width={props.width || s(14)}
    height={props.height || s(14)}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M9 11L11 13L15 9"
      stroke={props.fill || '#fff'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      fill={props.fill || '#3B82F6'}
      {...props}
    />
    <Path
      d="M9 11L11 13L15 9"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(IconVerified);
