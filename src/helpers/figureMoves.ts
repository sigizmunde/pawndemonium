import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Cell, Color, Move, Position, Role, SpaceMatrix } from '@/types';
import { cellInMatrix } from './cellInMatrix';
import { isEqualPosition } from './isEqual';
import { extendBoards, extendedCellToPosition } from './extendBoards';
import { watchLines } from './watchLines';
import { getFigureCost } from './getFigureCost';

export type GetMovesArgs = {
  boards: Board[];
  figure: Figure;
  figures: Figure[];
};

type ArgsWithPosition = GetMovesArgs & { figure: Figure & { position: Position } };

function getPawnMoves({ boards, figure, figures }: ArgsWithPosition): Move[] {
  const moves: Move[] = [];
  const { extendedMatrix, boardIds, extendedCell } = extendBoards({ boards, figure });
  const direction: number = figure.color === Color.WHITE ? -1 : 1;
  const possibleCell: Cell = [extendedCell[0], extendedCell[1] + direction];
  if (cellInMatrix(possibleCell, extendedMatrix)) {
    const possiblePosition = extendedCellToPosition({
      boardIds,
      extendedCell: possibleCell,
    });
    if (!figures.find((f) => isEqualPosition(f.position, possiblePosition))) {
      // if cell ahead is empty
      moves.push({ position: possiblePosition, points: 0 });
    }
  }
  const possibleAttackArray: Cell[] = [
    [extendedCell[0] - 1, extendedCell[1] + direction],
    [extendedCell[0] + 1, extendedCell[1] + direction],
  ];
  possibleAttackArray.forEach((extCell) => {
    const pos = extendedCellToPosition({
      boardIds,
      extendedCell: extCell,
    });
    const enemy = figures.find(
      (f) => isEqualPosition(f.position, pos) && f.color !== figure.color
    );
    if (enemy) {
      // if cell is occupied by an enemy
      moves.push({ position: pos, points: getFigureCost(enemy) });
    }
  });

  return moves;
}

function getKnightMoves({ boards, figure }: ArgsWithPosition): Move[] {
  const moves: Move[] = [];

  return moves;
}

function getKingMoves({ boards, figure }: ArgsWithPosition): Move[] {
  const moves: Move[] = [];

  return moves;
}

export function getPossibleMoves(args: GetMovesArgs): Move[] {
  const { figure } = args;
  if (figure.position) {
    switch (figure.role) {
      case Role.PAWN:
        return getPawnMoves(args as ArgsWithPosition);
      case Role.KNIGHT:
        return getKnightMoves(args as ArgsWithPosition);
      case Role.BISHOP:
      case Role.ROOK:
      case Role.QUEEN:
        return watchLines(args as ArgsWithPosition);
      case Role.KING:
        return getKingMoves(args as ArgsWithPosition);
      default:
        break;
    }
  }

  return [];
}
