import { Board } from '@/model/board';
import { Figure } from '@/model/figure';

export type Position = {
  board: string;
  cell: Cell;
};

/**
 * Cell[0] -- column
 * Cell[1] -- row
 */
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

export type ConditionParams = {
  boards: Board[];
  figures: Figure[];
  nextTurn: Color;
};

export type Condition = (args: ConditionParams) => boolean;

export type Level = {
  id: string;
  boards: Board[];
  figures: Figure[];
  objectives?: string;
  isAccomplished: Condition;
  isFailed?: Condition;
  extraConditions?: ((args: ConditionParams) => void)[];
  allowSinglePlayer?: boolean;
};

export type Message = {
  id?: string;
  sender?: { type: string; id: string } | string;
  message: string;
  arguments?: Object;
};

// --------------- level builder types --------------------
export type FigureSelector = {
  role?: Role;
  color: Color;
};

export type PositionPrecursor = {
  condition: 'board' | 'row' | 'column';
  comparator: 'eq' | 'in' | 'gt' | 'lt';
  negative: boolean;
  value: string | number | boolean;
};

export type AttackPrecursor = {
  condition: 'attacked' | 'attacks';
  figures?: FigureSelector[];
};

export type ConditionPrecursor = PositionPrecursor | AttackPrecursor;

export function isPositionPrecursor(obj: ConditionPrecursor): obj is PositionPrecursor {
  return 'comparator' in obj && 'value' in obj;
}

export type ConditionFrame = {
  nextTurn: Color;
  figureSelector: FigureSelector;
  conditionPrecursor: ConditionPrecursor;
};

export type StaticBoard = {
  id: string;
  space: SpaceMatrix;
};

export type StaticFigure = {
  id: string;
  role: Role;
  color: Color;
  position?: Position;
};

/**
 * in two-dimensional arrays of conditions
 * inner dimension contains conditional frames that are conjuncted
 * (they should be joined with AND operator),
 * those combined conditions then are being disjuncted
 * (joined with OR operator)
 */
export type LevelConcept = {
  id: string;
  staticBoards: StaticBoard[];
  staticFigures: StaticFigure[];
  objectives?: string;
  accomplishedChecks: ConditionFrame[][];
  failedChecks: ConditionFrame[][];
  // extraChecks?: yet not available
  allowSinglePlayer?: boolean;
};
// --------------------------------------------------------

// ------------------ move estimation types ---------------
export type EstimatedMove = {
  figure: Figure;
  move: Move;
  prohibited?: boolean;
  estimation: Estimation;
};

export type Estimation = EstimatedMove[];
// --------------------------------------------------------
