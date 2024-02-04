import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Cell, Position, SpaceMatrix } from '@/types';

export function extendBoards({
  boards,
  figure,
}: {
  boards: Board[];
  figure: Figure & { position: Position };
}) {
  const extendedMatrix = boards.reduce<SpaceMatrix>(
    (acc, b) => acc.map((column, i) => [...column, ...b.space[i]]),
    Array(8).fill([])
  );
  const boardIds = boards.map((b) => b.id);
  const extendedCell: Cell = [
    figure.position.cell[0],
    boardIds.findIndex((a) => a === figure.position.board) * 8 + figure.position.cell[1],
  ];
  return { extendedMatrix, boardIds, extendedCell };
}

export function extendedCellToPosition({
  boardIds,
  extendedCell,
}: {
  boardIds: string[];
  extendedCell: Cell;
}) {
  const boardNum = Math.floor(extendedCell[1] / 8);
  const board = boardIds[boardNum];
  const cell: Cell = [extendedCell[0], Math.floor(extendedCell[1] % 8)];
  return { board, cell };
}
