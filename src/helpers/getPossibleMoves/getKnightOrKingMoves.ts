import { Cell, Move, Role } from '@/types';
import { ArgsWithPosition } from '.';
import { extendBoards, extendedCellToPosition } from '../extendBoards';
import { cellInMatrix } from '../cellInMatrix';
import { isEqualPosition } from '../isEqual';
import { getFigureCost } from '../getFigureCost';

export function getKnightOrKingMoves({
  boards,
  figure,
  figures,
}: ArgsWithPosition): Move[] {
  const { extendedMatrix, boardIds, extendedCell } = extendBoards({ boards, figure });
  const [x, y] = extendedCell;
  const offsetArray =
    figure.role === Role.KNIGHT
      ? [
          [-2, -1],
          [-2, 1],
          [-1, -2],
          [-1, 2],
          [1, -2],
          [1, 2],
          [2, -1],
          [2, 1],
        ]
      : [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
          [-1, 0],
          [0, -1],
          [0, 1],
          [1, 0],
        ];
  return offsetArray.reduce<Move[]>((result, [dx, dy]) => {
    const possibleCell: Cell = [x + dx, y + dy];
    if (!cellInMatrix(possibleCell, extendedMatrix)) {
      return result;
    }
    const pos = extendedCellToPosition({ boardIds, extendedCell: possibleCell });
    const occupied = figures.find((f) => isEqualPosition(f.position, pos));
    if (occupied?.color !== figure.color) {
      result.push({
        position: pos,
        points: getFigureCost(occupied),
        kills: occupied || null,
      });
    }
    return result;
  }, []);
}
