import { Figure } from '@/model/figure';
import {
  AttackPrecursor,
  Condition,
  ConditionFrame,
  ConditionParams,
  PositionPrecursor,
} from '@/types';
import { getIsUnderAttack } from '../getIsUnderAttack';
import { Board } from '@/model/board';
import { getIsAttacking } from '../getIsAttacking';

function checkPositionCondition(figures: Figure[], precursor: PositionPrecursor) {
  return figures.some((f) => {
    const value = {
      board: f.position?.board || null,
      row: f.position?.cell[1],
      column: f.position?.cell[0],
    }[precursor.condition];
    let res = false;
    switch (precursor.comparator) {
      case 'eq':
        res = value === precursor.value;
        break;
      case 'in':
        res = Array.isArray(precursor.value) && precursor.value.includes(value);
        break;
      case 'gt':
        res = !!(value && value > precursor.value);
        break;
      case 'lt':
        res = !!(value && value < precursor.value);
    }
    return precursor.negative ? !res : res;
  });
}

function checkAttackCondition(
  figures: Figure[],
  precursor: AttackPrecursor,
  allFigures: Figure[],
  boards: Board[]
) {
  return figures.some((f) => {
    switch (precursor.condition) {
      case 'attacked':
        return !!(
          f.position &&
          getIsUnderAttack({
            position: f.position,
            figureColor: f.color,
            figures: allFigures,
            boards,
          })
        );
      case 'attacks':
        return getIsAttacking({ figure: f, figures: allFigures, boards });
    }
  });
}

/**
 * Creates a Condition function based on a single ConditionFrame, with optional board filtering.
 * @param frame - a single conditionFrame to be evaluated
 * @param boardIds - an optional array of board IDs to limit the region of interest for the condition
 * @returns a Condition function to integrate into level checks
 */
export function createCondition(frame: ConditionFrame, boardIds?: string[]): Condition {
  return (args: ConditionParams) => {
    if (args.nextTurn === frame.nextTurn) {
      const prefilteredByBoard = boardIds?.length
        ? args.figures.filter(
            (figure) =>
              figure.position?.board && boardIds.includes(figure.position?.board)
          )
        : args.figures;
      const checkedFigures = prefilteredByBoard.filter((figure) => {
        const selector = frame.figureSelector;
        if (selector.role && selector.role !== figure.role) {
          return false;
        }
        return selector.color === figure.color;
      });
      if (checkedFigures.length) {
        let positiveResult = true;
        if (frame.positionCondition) {
          positiveResult &&= checkPositionCondition(
            checkedFigures,
            frame.positionCondition
          );
        }
        if (positiveResult && frame.attackCondition) {
          positiveResult &&= checkAttackCondition(
            checkedFigures,
            frame.attackCondition,
            args.figures,
            args.boards
          );
        }
        return positiveResult;
      }
    }
    return false;
  };
}

export function combineConditions(
  rules: Condition[],
  condition: 'AND' | 'OR' = 'OR'
): Condition {
  return condition === 'AND'
    ? (args: ConditionParams) => rules.every((rule) => rule(args))
    : (args: ConditionParams) => rules.some((rule) => rule(args));
}

/**
 * Creates a complex Condition function based on a 2D array of ConditionFrames, with optional board filtering.
 * @param condFrames2D - a 2-dimensional array of conditionFrames to be evaluated, where the inner arrays represent groups of conditions to be combined with AND, and the outer array represents groups to be combined with OR
 * @param boardIds - an optional array of board IDs to limit the region of interest for the conditions (e.g., within the level boards)
 * @returns a Condition function to integrate into level checks
 */
export function createComplexCondition(
  condFrames2D: ConditionFrame[][],
  boardIds?: string[]
): Condition {
  return combineConditions(
    condFrames2D.map((frames1D) =>
      combineConditions(
        frames1D.map((frame) => createCondition(frame, boardIds)),
        'AND'
      )
    ),
    'OR'
  );
}
