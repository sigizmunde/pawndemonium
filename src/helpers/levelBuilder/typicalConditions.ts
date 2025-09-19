import { Color, ConditionParams, Role } from '@/types';

/**
 * extra conditions
 * these are functions that modify the game state
 * based on certain conditions being met
 */
export const pawnToQueen: (args: ConditionParams) => void = ({ figures }) => {
  figures.forEach((f) => {
    if (f.role === Role.PAWN && f.color === Color.BLACK && f.position?.cell[1] === 7) {
      f.role = Role.QUEEN;
    }
  });
};

/**
 * accomplished and failed conditions
 */
export const noMoreWhiteFigures: (args: ConditionParams) => boolean = ({ figures }) => {
  return !figures.some((f) => f.position && f.color === Color.WHITE);
};

export const noMoreBlackFigures: (args: ConditionParams) => boolean = ({ figures }) => {
  return !figures.some((f) => f.position && f.color === Color.BLACK);
};
