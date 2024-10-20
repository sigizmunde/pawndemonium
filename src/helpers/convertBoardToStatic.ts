import { Board } from '@/model/board';
import { StaticBoard } from '@/types';

export function convertBoardToStatic(inputArgs: Board): StaticBoard {
  const { id, space } = inputArgs;
  return { id, space };
}
