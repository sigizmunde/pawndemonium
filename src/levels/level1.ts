import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Level, Role } from '@/types';

const boardId = 'level1_board0';

const level: Level = {
  boards: [],
  figures: [],
  objectives: 'Here is your King!\n_\nKeep moving figures!',
  isAccomplished: ({ boards, figures }) => {
    if (figures.some((f) => f.position?.board !== boardId)) {
      return false;
    }
    return true;
  },
};

const newBoard = new Board({
  id: boardId,
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

level.boards = [newBoard];

const blackPawn1 = new Figure({
  id: 'pawn1b',
  role: Role.PAWN,
  color: Color.BLACK,
  position: { board: boardId, cell: [3, 6] },
});

const blackKing = new Figure({
  id: 'kingb',
  role: Role.KING,
  color: Color.BLACK,
  position: { board: boardId, cell: [4, 0] },
});

const blackRook = new Figure({
  id: 'rook1b',
  role: Role.ROOK,
  color: Color.BLACK,
  position: { board: boardId, cell: [0, 7] },
});

level.figures = [blackPawn1, blackKing, blackRook];
level.allowSinglePlayer = true;
level.extraConditions = [
  ({ boards, figures, nextTurn }) => {
    figures.forEach((f) => {
      if (f.role === Role.PAWN && f.position?.cell[1] === 7) {
        f.role = Role.BISHOP;
      }
    });
  },
];

export default level;
