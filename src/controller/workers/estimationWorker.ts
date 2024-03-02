import { WorkerInputData, convertInputData } from '@/helpers/convertWorkerData';
import { estimate } from '../estimate';

addEventListener('message', (event: MessageEvent<WorkerInputData>) => {
  const convertedArgs = convertInputData(event.data);
  const result = estimate(convertedArgs);
  postMessage(result);
});
