import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Position, Role } from '@/types';
import { getPossibleMoves } from './getPossibleMoves';

/**
 * iteratively searches for any figure under attack
 * of the given figure, if finds one, returns true
 */
export function getIsAttacking({
  figure,
  figures,
  boards,
}: {
  figure: Figure;
  figures: Figure[];
  boards: Board[];
}): boolean {
  const moves = getPossibleMoves({ boards, figures, figure });
  return moves.some((move) => move.kills);
}
