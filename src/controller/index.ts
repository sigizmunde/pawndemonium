import { getPossibleMoves } from '@/helpers/getPossibleMoves';
import { isEqualPosition } from '@/helpers/isEqual';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Cell, Color, Level, Message, Position } from '@/types';

export class Controller {
  private _nextTurn: Color = Color.WHITE;
  private _moveCount = 0;
  private _instance?: Controller;
  private _fieldLength = 2;
  boards: Board[] = [];
  figures: Figure[] = [];
  levels: Level[] = [];
  private _level = 0;
  private _onEvent: Function | undefined;

  constructor(onEvent?: Function) {
    if (!this._instance) {
      this._instance = this;
    }
    this._onEvent = this._onEvent || onEvent;
    return this._instance;
  }

  get moveCount() {
    return this._moveCount;
  }

  get nextTurn() {
    return this._nextTurn;
  }

  setFieldLength(l: number) {
    if (this.boards.length > l) {
      return;
    }
    this._fieldLength = l;
  }

  cellIsAvailable(position: Position) {
    const board = this.boards.find((b) => b.id === position.board);
    if (!board) {
      return false;
    }
    const [x, y] = position.cell;
    return board.space[x][y];
  }

  killTheFigure(figure: Figure) {
    if (!figure.position) {
      return;
    }
    figure.remove();
  }

  findFigureInCell(position: Position) {
    return this.figures.find((f) => isEqualPosition(f.position, position));
  }

  makeAMove(start: Figure | Position, stop: Position | Cell) {
    const figure = start instanceof Figure ? start : this.findFigureInCell(start);
    const stopHasBoard = 'board' in stop;
    if (!figure || !(figure.position || stopHasBoard)) {
      return;
    }
    const destination = stopHasBoard
      ? stop
      : { board: figure.position!.board, cell: stop };
    if (!this.cellIsAvailable(destination)) {
      this._notify({
        sender: 'controller',
        message: 'Impossible move, cell is closed',
      });
      return;
    }
    const enemy = this.findFigureInCell(destination);
    if (enemy) {
      this.killTheFigure(enemy);
      this._notify({
        sender: 'controller',
        message: `${enemy.color} ${enemy.role} was killed by ${figure.color} ${figure.role}`,
      });
    }
    figure.move(destination);
    this._moveCount += 1;
    this._nextTurn = this._nextTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  getFigureMoves(figure: Figure) {
    return getPossibleMoves({ boards: this.boards, figure, figures: this.figures });
  }

  loadLevel(index?: number) {
    console.log(this.levels);
    if (!index) {
      index = this._level + 1;
    }
    if (!this.levels?.length) {
      return;
    }
    if (this.levels.length - 1 < index) {
      index = 0;
    }
    this.boards.push(...this.levels[index].boards);
    this.figures.push(...this.levels[index].figures);
    this._level = index;
  }

  private _notify(message: Message) {
    if (this._onEvent) {
      this._onEvent({ id: Date.now().toString(), ...message });
    }
  }
}
