import { ESwipeType } from '@/components/ui/swipeItem';

export interface Song {
  id: number;
  title: string;
  singer: string;
  imageSrc: string;
  type?: ESwipeType;
}
