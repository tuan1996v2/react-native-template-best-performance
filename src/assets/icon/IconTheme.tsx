import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  fill?: string;
  width?: number;
  height?: number;
}

const IconTheme = ({ fill = '#000', width = 24, height = 24 }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 3V21" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path
      d="M12 21C12 21 12 18 12 12C12 6 12 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      fill={fill}
    />
  </Svg>
);

export default IconTheme;
