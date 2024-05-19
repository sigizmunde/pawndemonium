import { Figure } from '@/model/figure';
import {
  AttackPrecursor,
  Condition,
  ConditionFrame,
  ConditionParams,
  PositionPrecursor,
  isPositionPrecursor,
} from '@/types';

function checkPositionCondition(figures: Figure[], precursor: PositionPrecursor) {
  //
}

function checkAttackCondition(figures: Figure[], precursor: AttackPrecursor) {
  //
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
        if (isPositionPrecursor(frame.conditionPrecursor)) {
          return checkPositionCondition(checkedFigures, frame.conditionPrecursor);
        } else {
          return checkAttackCondition(checkedFigures, frame.conditionPrecursor);
        }
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
