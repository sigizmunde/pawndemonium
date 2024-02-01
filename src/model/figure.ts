import { Cell, Color, Role, Position, Message } from '@/types';

export class Figure {
  private _id: string;
  role: Role;
  position: Position | null = null;
  private _color: Color;
  private _onEvent: Function | undefined;

  constructor({
    id,
    role,
    color,
    onEvent,
    position,
  }: {
    id: string;
    role: Role;
    color: Color;
    onEvent?: Function;
    position?: Position;
  }) {
    this._id = id;
    this.role = role;
    this._color = color;
    this._onEvent = onEvent || this._onEvent;
    this.position = position || this.position;
  }

  get id() {
    return this._id;
  }

  get color() {
    return this._color;
  }

  remove() {
    this.position = null;
  }

  move(position: Position | Cell) {
    if ('board' in position) {
      this.position = position;
      this._notify({
        sender: { type: 'figure', id: this._id },
        message: `Moved to cell ${position.cell[0]}:${position.cell[1]} on board ${position.board}`,
      });
      return 1;
    } else {
      if (!this.position) {
        this._notify({
          sender: { type: 'figure', id: this._id },
          message: `ERROR: No board passed`,
        });
        return 0;
      }
      this.position.cell = position;
      this._notify({
        sender: { type: 'figure', id: this._id },
        message: `Moved to cell ${position[0]}:${position[1]}`,
      });
    }
  }

  private _notify(message: Message) {
    if (this._onEvent) {
      this._onEvent({ id: Date.now().toString(), ...message });
    }
  }
}
