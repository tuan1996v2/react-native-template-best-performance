import { s } from '@/theme/Responsive';
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const IconLoading = (props: SvgProps) => (
  <Svg
    width={props.width || s(24)}
    height={props.height || s(24)}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Path
      d="M12 2V6"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 18V22"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.93 4.93L7.76 7.76"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.24 16.24L19.07 19.07"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12H6"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 12H22"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.93 19.07L7.76 16.24"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.24 7.76L19.07 4.93"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(IconLoading);
