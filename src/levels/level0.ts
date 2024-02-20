import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Level, Role } from '@/types';

const level: Level = {
  boards: [],
  figures: [],
  objectives:
    'You are a lonely pawn moving forward.\n_\nHere your journey starts. Move forward!',
  isAccomplished: ({ boards, figures }) => {
    if (
      figures.some(
        (f) => f.position?.board === 'level0_board1' && f.position.cell[1] === 7
      )
    ) {
      return true;
    }
    return false;
  },
};

const newBoard = new Board({
  id: 'level0_board0',
  space: [
    Array(8).fill(false),
    Array(8).fill(false),
    Array(8).fill(true),
    Array(8).fill(true),
    Array(8).fill(true),
    Array(8).fill(true),
    Array(8).fill(false),
    Array(8).fill(false),
  ],
});

const newBoard2 = new Board({
  id: 'level0_board1',
  space: [
    Array(8).fill(false),
    Array(8).fill(false),
    [...Array(3).fill(true), false, ...Array(4).fill(true)],
    [...Array(3).fill(true), false, ...Array(4).fill(true)],
    [...Array(4).fill(true), false, ...Array(3).fill(true)],
    [...Array(4).fill(true), false, ...Array(3).fill(true)],
    Array(8).fill(false),
    Array(8).fill(false),
  ],
});

const pawn1 = new Figure({
  id: 'starting_figure',
  role: Role.PAWN,
  color: Color.BLACK,
  position: { board: 'level0_board0', cell: [4, 0] },
});

level.boards = [newBoard, newBoard2];
level.figures = [pawn1];
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
