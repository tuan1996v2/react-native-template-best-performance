import { s } from '@/theme/Responsive';
import * as React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';

const IconLanguage = (props: SvgProps) => (
  <Svg
    width={props.width || s(24)}
    height={props.height || s(24)}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12H22"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z"
      stroke={props.fill || '#000'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default React.memo(IconLanguage);
