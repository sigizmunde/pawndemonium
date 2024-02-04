import { Cell, Move, Position, Role } from '@/types';
import { cellInMatrix } from './cellInMatrix';
import { Figure } from '@/model/figure';
import { Board } from '@/model/board';
import { extendBoards, extendedCellToPosition } from './extendBoards';
import { isEqualPosition } from './isEqual';
import { getFigureCost } from './getFigureCost';

type WLFunctionProps = {
  figure: Figure & { position: Position };
  boards: Board[];
  figures: Figure[];
};

export function watchLines({ figure, boards, figures }: WLFunctionProps): Move[] {
  const directions = (() => {
    switch (figure?.role) {
      case Role.BISHOP:
        return [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ];
      case Role.ROOK:
        return [
          [-1, 0],
          [0, -1],
          [0, 1],
          [1, 0],
        ];
      case Role.QUEEN:
        return [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
          [-1, 0],
          [0, -1],
          [0, 1],
          [1, 0],
        ];
      default:
        return [];
    }
  })();
  const { extendedMatrix, boardIds, extendedCell } = extendBoards({ boards, figure });
  const moves = directions.reduce<Move[]>((result, direction) => {
    let currentCell = extendedCell;
    let exit = false;
    while (!exit) {
      const [x, y] = currentCell;
      const [dx, dy] = direction;
      currentCell = [x + dx, y + dy];
      if (cellInMatrix(currentCell, extendedMatrix)) {
        const pos = extendedCellToPosition({ boardIds, extendedCell: currentCell });
        const occupied = figures.find((f) => isEqualPosition(f.position, pos));
        if (occupied?.color !== figure.color) {
          result.push({ position: pos, points: getFigureCost(occupied) });
        }
        if (occupied) {
          exit = true;
        }
      } else {
        exit = true;
      }
    }
    return result;
  }, []);
  return moves;
}
