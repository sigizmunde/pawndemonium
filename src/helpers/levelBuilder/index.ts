import { Level, LevelConcept } from '@/types';
import { createComplexCondition } from './conditionFunctions';
import { Figure } from '@/model/figure';
import { Board } from '@/model/board';
import { noMoreBlackFigures, noMoreWhiteFigures, pawnToQueen } from './typicalConditions';

export function createLevel(
  concept: LevelConcept,
  options: { pawnToQueen: boolean } = { pawnToQueen: true }
): Level {
  const {
    id,
    staticBoards,
    staticFigures,
    objectives,
    allowSinglePlayer,
    accomplishedChecks: ac,
    failedChecks: fc,
  } = concept;

  const figures = staticFigures.map((sf) => new Figure({ ...sf, onEvent: undefined }));
  const boards = staticBoards.map((sb) => new Board({ id: sb.id, space: sb.space }));
  const boardIds = boards.map((board) => board.id);

  // TODO: return default checks if no checks added
  return {
    id,
    boards,
    figures,
    objectives,
    isAccomplished: ac.length ? createComplexCondition(ac, boardIds) : noMoreWhiteFigures,
    isFailed: fc.length ? createComplexCondition(fc, boardIds) : noMoreBlackFigures,
    extraConditions: options.pawnToQueen ? [pawnToQueen] : [],
    allowSinglePlayer,
  };
}
