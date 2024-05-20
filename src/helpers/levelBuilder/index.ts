import { Level, LevelConcept } from '@/types';
import { createComplexCondition } from './conditionFunctions';

export function createLevel(concept: LevelConcept): Level {
  const {
    boards,
    figures,
    objectives,
    allowSinglePlayer,
    accomplishedChecks: ac,
    failedChecks: fc,
  } = concept;
  return {
    boards,
    figures,
    objectives,
    isAccomplished: createComplexCondition(ac),
    isFailed: createComplexCondition(fc),
    // extraChecks not available yet
    allowSinglePlayer,
  };
}
