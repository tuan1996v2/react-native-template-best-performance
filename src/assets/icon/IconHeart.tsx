import { s } from '@/theme/Responsive';
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const IconHeart = (props: SvgProps & { liked?: boolean }) => (
  <Svg
    width={props.width || s(24)}
    height={props.height || s(24)}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78v0Z"
      stroke={props.liked ? props.fill || '#EF4444' : props.stroke || '#6B7280'}
      fill={props.liked ? props.fill || '#EF4444' : 'none'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(IconHeart);
