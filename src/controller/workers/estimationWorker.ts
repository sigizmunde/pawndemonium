import { WorkerInputData, convertInputData } from '@/helpers/convertWorkerData';
import { estimate } from '../estimate';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Move, Position, Role, SpaceMatrix } from '@/types';

addEventListener('message', (event: MessageEvent<WorkerInputData>) => {
  const convertedArgs = convertInputData(event.data);
  const result = estimate(convertedArgs);
  postMessage(result);
});
