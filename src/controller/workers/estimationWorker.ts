import { estimate } from '../estimate';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Move } from '@/types';

type Args = {
  estimatedMove?: Move;
  figures: Figure[];
  boards: Board[];
  color: Color;
  depth?: number;
};

addEventListener('message', (event: MessageEvent<Args>) => {
  console.log('Worker received message', event.data);
  const args = event.data;
  const result = estimate(args);
  postMessage(result);
});
