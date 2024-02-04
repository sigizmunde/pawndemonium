import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Move, Position, Role } from '@/types';
import { getLongFigureMoves } from './getLongFigureMoves';
import { getPawnMoves } from './getPawnMoves';
import { getKnightOrKingMoves } from './getKnightOrKingMoves';

export type GetMovesArgs = {
  boards: Board[];
  figure: Figure;
  figures: Figure[];
};

export type ArgsWithPosition = GetMovesArgs & { figure: Figure & { position: Position } };

export function getPossibleMoves(args: GetMovesArgs): Move[] {
  const { figure } = args;
  if (figure.position) {
    switch (figure.role) {
      case Role.PAWN:
        return getPawnMoves(args as ArgsWithPosition);
      case Role.BISHOP:
      case Role.ROOK:
      case Role.QUEEN:
        return getLongFigureMoves(args as ArgsWithPosition);
      case Role.KNIGHT:
      case Role.KING:
        return getKnightOrKingMoves(args as ArgsWithPosition);
      default:
        break;
    }
  }

  return [];
}
