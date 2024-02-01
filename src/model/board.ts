import { Cell, Message, SpaceMatrix } from '@/types';
import { Figure } from './figure';

export class Board {
  private _id: string;
  private _space: SpaceMatrix;

  constructor({ id, space }: { id: string; space: SpaceMatrix }) {
    this._id = id;
    this._space = space;
  }

  get id() {
    return this._id;
  }

  get space() {
    return this._space;
  }
}
