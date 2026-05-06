import { s } from '@/theme/Responsive';
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const IconComment = (props: SvgProps) => (
  <Svg
    width={props.width || s(24)}
    height={props.height || s(24)}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Path
      d="M21 11.5C21 15.5868 16.9706 18.9 12 18.9C10.7061 18.9 9.48493 18.6653 8.39708 18.2366L4 20L5.3085 16.3262C4.48425 14.9961 4 13.3101 4 11.5C4 7.4132 8.02944 4.1 13 4.1C17.9706 4.1 22 7.4132 22 11.5Z"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(IconComment);
