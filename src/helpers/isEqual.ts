import { Cell, Position } from '@/types';

export function isEqualCell(a: Cell, b: Cell) {
  return a[0] === b[0] && a[1] === b[1];
}

export function isEqualPosition(a: Position | null, b: Position | null) {
  return a && b && a.board === b.board && isEqualCell(a.cell, b.cell);
}
