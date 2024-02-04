import { Figure } from '@/model/figure';
import { Role } from '@/types';

export function getFigureCost(figure: Figure | undefined) {
  switch (figure?.role) {
    case Role.PAWN:
      return 1;
    case Role.KNIGHT:
    case Role.BISHOP:
      return 3.5;
    case Role.ROOK:
      return 6;
    case Role.QUEEN:
      return 10;
    case Role.KING:
      return 100;
    default:
      return 0;
  }
}
