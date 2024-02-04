import { Cell, SpaceMatrix } from '@/types';

export function cellInMatrix(cell: Cell, matrix: SpaceMatrix) {
  return matrix[cell[0]]?.[cell[1]];
}
