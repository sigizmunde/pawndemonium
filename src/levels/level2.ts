import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Level, Role } from '@/types';

const boardId = 'level2_board0';

const level: Level = {
  boards: [],
  figures: [],
  objectives:
    'You found yourselves rushing forward through a dark and long chamber with a bunch of hostile white figures in it.\nGet your King to the top row of the hall whatever it takes.',
  isAccomplished: ({ boards, figures }) => {
    if (
      figures.some(
        (f) =>
          f.role === Role.KING &&
          f.position?.board === boardId &&
          f.position.cell[1] === 7
      )
    ) {
      return true;
    }
    return false;
  },
};

const newBoard2 = new Board({
  id: boardId,
  space: Array(8).fill(Array(8).fill(true)),
});

level.boards = [newBoard2];

const pawn1 = new Figure({
  id: 'pawn1',
  role: Role.PAWN,
  color: Color.WHITE,
  position: { board: boardId, cell: [3, 7] },
});

const pawn2 = new Figure({
  id: 'pawn2',
  role: Role.PAWN,
  color: Color.WHITE,
  position: { board: boardId, cell: [4, 6] },
});

const blackQueen = new Figure({
  id: 'qb',
  role: Role.QUEEN,
  color: Color.BLACK,
  position: { board: boardId, cell: [3, 3] },
});

const whiteQueen = new Figure({
  id: 'qw',
  role: Role.QUEEN,
  color: Color.WHITE,
  position: { board: boardId, cell: [7, 2] },
});

const whiteRook = new Figure({
  id: 'rook1w',
  role: Role.ROOK,
  color: Color.WHITE,
  position: { board: boardId, cell: [6, 2] },
});

const whiteKnight = new Figure({
  id: 'knight1w',
  role: Role.KNIGHT,
  color: Color.WHITE,
  position: { board: boardId, cell: [4, 2] },
});

level.figures = [pawn1, pawn2, blackQueen, whiteQueen, whiteRook, whiteKnight];

export default level;
