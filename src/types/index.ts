export type Position = {
    board: string,
    cell: Cell,
}

export type Cell = [number, number];

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

export type Message = {
    id?: string,
    sender?: { type: string, id: string } | string,
    message: string,
    arguments?: Object,
}