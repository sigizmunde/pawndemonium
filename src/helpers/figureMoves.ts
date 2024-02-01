import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Cell, Position, Role, SpaceMatrix } from '@/types';
import { cellInMatrix } from './cellInMatrix';
import { isEqualPosition } from './isEqual';

export type GetMovesArgs = {
  boards: Board[];
  figure: Figure;
  figures: Figure[];
};

type ArgsWithPosition = GetMovesArgs & { figure: Figure & { position: Position } };

function extendBoards({
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
  console.log(extendedMatrix);
  const boardIds = boards.map((b) => b.id);
  const extendedCell = [
    figure.position.cell[0],
    boardIds.findIndex((a) => a === figure.position.board) * 8 + figure.position.cell[1],
  ];
  return { extendedMatrix, boardIds, extendedCell };
}

function extendedCellToPosition({
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

// TODO: color defines direction
function getPawnMoves({ boards, figure, figures }: ArgsWithPosition): Position[] {
  const moves: Position[] = [];
  const { extendedMatrix, boardIds, extendedCell } = extendBoards({ boards, figure });
  const possibleCell: Cell = [extendedCell[0], extendedCell[1] + 1];
  if (cellInMatrix(possibleCell, extendedMatrix)) {
    const possiblePosition = extendedCellToPosition({
      boardIds,
      extendedCell: possibleCell,
    });
    if (!figures.find((f) => isEqualPosition(f.position, possiblePosition))) {
      // if cell ahead is empty
      moves.push(possiblePosition);
    }
  }
  const possibleAttackArray: Cell[] = [
    [extendedCell[0] - 1, extendedCell[1] + 1],
    [extendedCell[0] + 1, extendedCell[1] + 1],
  ];
  possibleAttackArray.forEach((extCell) => {
    const pos = extendedCellToPosition({
      boardIds,
      extendedCell: extCell,
    });
    if (
      figures.find((f) => isEqualPosition(f.position, pos) && f.color !== figure.color)
    ) {
      // if cell is occupied by an enemy
      moves.push(pos);
    }
  });

  return moves;
}

function getKnightMoves({ boards, figure }: ArgsWithPosition): Position[] {
  const moves: Position[] = [];

  return moves;
}

function getBishopMoves({ boards, figure }: ArgsWithPosition): Position[] {
  const moves: Position[] = [];

  return moves;
}

function getRookMoves({ boards, figure }: ArgsWithPosition): Position[] {
  const moves: Position[] = [];

  return moves;
}

function getQueenMoves({ boards, figure }: ArgsWithPosition): Position[] {
  const moves: Position[] = [];

  return moves;
}

function getKingMoves({ boards, figure }: ArgsWithPosition): Position[] {
  const moves: Position[] = [];

  return moves;
}

export function getPossibleMoves(args: GetMovesArgs): Position[] {
  const { figure } = args;
  if (figure.position) {
    switch (figure.role) {
      case Role.PAWN:
        return getPawnMoves(args as ArgsWithPosition);
      case Role.KNIGHT:
        return getKnightMoves(args as ArgsWithPosition);
      case Role.BISHOP:
        return getBishopMoves(args as ArgsWithPosition);
      case Role.ROOK:
        return getRookMoves(args as ArgsWithPosition);
      case Role.QUEEN:
        return getQueenMoves(args as ArgsWithPosition);
      case Role.KING:
        return getKingMoves(args as ArgsWithPosition);
    }
  }

  return [];
}
