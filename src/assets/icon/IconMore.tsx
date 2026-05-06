import { s } from '@/theme/Responsive';
import * as React from 'react';
import Svg, { Circle, SvgProps } from 'react-native-svg';

const IconMore = (props: SvgProps) => (
  <Svg
    width={props.width || s(24)}
    height={props.height || s(24)}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Circle
      cx="5"
      cy="12"
      r="1"
      fill={props.fill || '#000'}
      stroke={props.fill || '#000'}
      strokeWidth="2"
    />
    <Circle
      cx="12"
      cy="12"
      r="1"
      fill={props.fill || '#000'}
      stroke={props.fill || '#000'}
      strokeWidth="2"
    />
    <Circle
      cx="19"
      cy="12"
      r="1"
      fill={props.fill || '#000'}
      stroke={props.fill || '#000'}
      strokeWidth="2"
    />
  </Svg>
);

export default React.memo(IconMore);
