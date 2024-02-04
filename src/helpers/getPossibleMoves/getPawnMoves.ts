import { Cell, Color, Move } from '@/types';
import { ArgsWithPosition } from '.';
import { extendBoards, extendedCellToPosition } from '../extendBoards';
import { cellInMatrix } from '../cellInMatrix';
import { isEqualPosition } from '../isEqual';
import { getFigureCost } from '../getFigureCost';

export function getPawnMoves({ boards, figure, figures }: ArgsWithPosition): Move[] {
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
