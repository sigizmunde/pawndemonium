import { Level, LevelConcept } from '@/types';
import { createComplexCondition } from './conditionFunctions';
import { Figure } from '@/model/figure';
import { Board } from '@/model/board';

export function createLevel(concept: LevelConcept): Level {
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

  // TODO: return default checks if no checks added
  return {
    id,
    boards,
    figures,
    objectives,
    isAccomplished: createComplexCondition(ac),
    isFailed: createComplexCondition(fc),
    // extraChecks not available yet
    allowSinglePlayer,
  };
}
