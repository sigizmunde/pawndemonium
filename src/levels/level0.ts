import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Level, Role } from '@/types';

const level: Level = { boards: [], figures: [] };

const newBoard = new Board({
  id: 'l0b0',
  space: [
    [false, false, false, false, true, true, false, true],
    Array(8).fill(true),
    Array(8).fill(true),
    Array(8).fill(true),
    Array(8).fill(true),
    Array(8).fill(true),
    [false, true, false, true, true, true, false, true],
    [false, false, false, false, true, true, false, false],
  ],
});

const newBoard2 = new Board({
  id: 'l0b1',
  space: Array(8).fill(Array(8).fill(true)),
});

level.boards = [newBoard, newBoard2];

const pawn1 = new Figure({
  id: 'pawn1',
  role: Role.PAWN,
  color: Color.WHITE,
  position: { board: 'l0b1', cell: [3, 7] },
});

const pawn2 = new Figure({
  id: 'pawn2',
  role: Role.PAWN,
  color: Color.WHITE,
  position: { board: 'l0b1', cell: [4, 6] },
});

const blackPawn1 = new Figure({
  id: 'pawn1b',
  role: Role.PAWN,
  color: Color.BLACK,
  position: { board: 'l0b0', cell: [3, 7] },
});

const blackKing = new Figure({
  id: 'kingb',
  role: Role.KING,
  color: Color.BLACK,
  position: { board: 'l0b0', cell: [4, 0] },
});

const blackQueen = new Figure({
  id: 'qb',
  role: Role.QUEEN,
  color: Color.BLACK,
  position: { board: 'l0b1', cell: [3, 3] },
});

const whiteQueen = new Figure({
  id: 'qw',
  role: Role.QUEEN,
  color: Color.WHITE,
  position: { board: 'l0b1', cell: [7, 2] },
});

const whiteRook = new Figure({
  id: 'rook1w',
  role: Role.ROOK,
  color: Color.WHITE,
  position: { board: 'l0b1', cell: [6, 2] },
});

const blackRook = new Figure({
  id: 'rook1b',
  role: Role.ROOK,
  color: Color.BLACK,
  position: { board: 'l0b0', cell: [0, 7] },
});

const whiteKnight = new Figure({
  id: 'knight1w',
  role: Role.KNIGHT,
  color: Color.WHITE,
  position: { board: 'l0b1', cell: [4, 2] },
});

const blackBishop = new Figure({
  id: 'bishop1b',
  role: Role.BISHOP,
  color: Color.BLACK,
  position: { board: 'l0b1', cell: [1, 0] },
});

level.figures = [
  pawn1,
  pawn2,
  blackQueen,
  whiteQueen,
  whiteRook,
  blackPawn1,
  blackKing,
  blackRook,
  whiteKnight,
  blackBishop,
];

export default level;
