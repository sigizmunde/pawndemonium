import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Position, Role } from '@/types';
import { getPossibleMoves } from './getPossibleMoves';

/**
 * iteratively searches for attacking figure,
 * if finds one, stops and returns true
 */
export function getIsUnderAttack({
  position,
  figureColor,
  figures,
  boards,
}: {
  position: Position;
  figureColor: Color;
  figures: Figure[];
  boards: Board[];
}): boolean {
  const virtualFigure = new Figure({
    id: 'virtual_actor',
    position,
    color: figureColor,
    role: Role.ROOK,
  });
  // Queen has union of Rook and Bishop moves, so it may be checked in their iterations
  const roles = [Role.ROOK, Role.BISHOP, Role.KNIGHT, Role.PAWN, Role.KING];
  for (const role of roles) {
    virtualFigure.role = role;
    const moves = getPossibleMoves({ boards, figures, figure: virtualFigure });
    const rolesToCheck = {
      [Role.ROOK]: [Role.ROOK, Role.QUEEN],
      [Role.BISHOP]: [Role.BISHOP, Role.QUEEN],
      [Role.KNIGHT]: [Role.KNIGHT],
      [Role.PAWN]: [Role.PAWN, Role.KING],
      [Role.KING]: [Role.KING],
      // Queen added here to match TypeScript Role type
      [Role.QUEEN]: [Role.QUEEN],
    }[role];
    if (moves.some((move) => move.kills && rolesToCheck.includes(move.kills.role))) {
      return true;
    }
  }
  return false;
}
