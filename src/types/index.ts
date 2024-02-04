export type Position = {
  board: string;
  cell: Cell;
};

export type Cell = [number, number];

export type Move = { position: Position; points: number };
export type MoveCell = { cell: Cell; points: number };

export type SpaceMatrix = boolean[][];

export enum Role {
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN,
  KING,
}

export enum Color {
  BLACK,
  WHITE,
}

enum Offset {
  PLUS = 1,
  ZERO = 0,
  MINUS = -1,
}

export type Direction = [Offset, Offset];

export type Message = {
  id?: string;
  sender?: { type: string; id: string } | string;
  message: string;
  arguments?: Object;
};
