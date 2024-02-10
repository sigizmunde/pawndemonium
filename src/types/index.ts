import { Board } from '@/model/board';
import { Figure } from '@/model/figure';

export type Position = {
  board: string;
  cell: Cell;
};

export type Cell = [number, number];

export type Move = { position: Position; points: number; kills: null | Figure };
export type MoveCell = { cell: Cell; points: number };

export type SpaceMatrix = boolean[][];

export enum Role {
  PAWN = 'pawn',
  KNIGHT = 'knight',
  BISHOP = 'bishop',
  ROOK = 'rook',
  QUEEN = 'queen',
  KING = 'king',
}

export enum Color {
  BLACK = 'black',
  WHITE = 'white',
}

enum Offset {
  PLUS = 1,
  ZERO = 0,
  MINUS = -1,
}

export type Direction = [Offset, Offset];

type ConditionParams = {
  boards: Board[];
  figures: Figure[];
  nextTurn: Color;
};
export type Condition = (args: ConditionParams) => boolean;
export type Level = {
  boards: Board[];
  figures: Figure[];
  objectives?: string;
  isAccomplished: Condition;
  isFailed?: Condition;
};

export type EstimatedMove = {
  figure: Figure;
  move: Move;
  prohibited?: boolean;
  estimation: Estimation;
};
export type Estimation = EstimatedMove[];

export type Message = {
  id?: string;
  sender?: { type: string; id: string } | string;
  message: string;
  arguments?: Object;
};
