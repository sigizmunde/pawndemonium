import { Figure } from '@/model/figure';
import { Role } from '@/types';

export function getFigureCost(figure: Figure | undefined) {
  switch (figure?.role) {
    case Role.PAWN:
      return 1;
    case Role.KNIGHT:
    case Role.BISHOP:
      return 3;
    case Role.ROOK:
      return 5;
    case Role.QUEEN:
      return 9;
    case Role.KING:
      return 200;
    default:
      return 0;
  }
}
