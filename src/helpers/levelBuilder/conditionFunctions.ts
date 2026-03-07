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

export function createCondition(frame: ConditionFrame) {
  return (args: ConditionParams) => {
    if (args.nextTurn === frame.nextTurn) {
      const checkedFigures = args.figures.filter((figure) => {
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

export function createComplexCondition(condFrames2D: ConditionFrame[][]): Condition {
  return combineConditions(
    condFrames2D.map((frames1D) =>
      combineConditions(
        frames1D.map((frame) => createCondition(frame)),
        'AND'
      )
    ),
    'OR'
  );
}
