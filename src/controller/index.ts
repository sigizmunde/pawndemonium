import { getPossibleMoves } from '@/helpers/getPossibleMoves';
import { isEqualPosition } from '@/helpers/isEqual';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Cell, Color, Estimation, Level, Message, Position, Role } from '@/types';
import { estimate } from './estimate';
import { mockTheMove } from '@/helpers/mockTheMove';
import { getIsUnderAttack } from '@/helpers/getIsUnderAttack';

export class Controller {
  private _instance?: Controller;
  private _gameStatus = { over: false, status: '' };
  private _nextTurn: Color = Color.WHITE;
  private _moveCount = 0;
  boards: Board[] = [];
  figures: Figure[] = [];
  levels: Level[] = [];
  private _level = 0;
  private _onEvent: Function | undefined;
  onUpdate: Function = () => {};

  constructor(onEvent?: Function) {
    if (!this._instance) {
      this._instance = this;
    }
    this._onEvent = this._onEvent || onEvent;
    return this._instance;
  }

  get gameStatus() {
    return this._gameStatus;
  }

  get moveCount() {
    return this._moveCount;
  }

  get nextTurn() {
    return this._nextTurn;
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
    this.checkConditions();
    this.onUpdate(this._moveCount);
  }

  getFigureMoves(figure: Figure) {
    return getPossibleMoves({
      boards: this.boards,
      figure,
      figures: this.figures,
    }).filter((move) => {
      const { newFigures } = mockTheMove({ move, figure, figures: this.figures });
      const allyKing = newFigures.find(
        (f) => f.role === Role.KING && f.color === figure.color
      );
      return (
        !allyKing?.position ||
        !getIsUnderAttack({
          position: allyKing.position,
          figureColor: figure.color,
          figures: newFigures,
          boards: this.boards,
        })
      );
    });
  }

  checkIfFailed() {
    if (
      !this.figures
        .filter((f) => f.color === this.nextTurn)
        .some((f) => this.getFigureMoves(f).length > 0)
    ) {
      if (this.levels?.[this._level]?.allowSinglePlayer) {
        this._moveCount += 1;
        this._nextTurn = this._nextTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
        this.onUpdate(this._moveCount);
        return;
      }
      this._gameStatus = {
        over: true,
        status: `${this.nextTurn === Color.BLACK ? 'You' : 'Your enemy'} may nothing to do`,
      };
      return;
    }
    if (
      this.levels?.[this._level] &&
      this.levels[this._level].isFailed &&
      this.levels[this._level].isFailed!({
        figures: this.figures,
        boards: this.boards,
        nextTurn: this.nextTurn,
      })
    ) {
      this._gameStatus = { over: true, status: 'You failed to pass this level' };
    }
  }

  checkIfAccomplished(): boolean {
    if (
      this.levels?.[this._level] &&
      this.levels[this._level].isAccomplished({
        figures: this.figures,
        boards: this.boards,
        nextTurn: this.nextTurn,
      })
    ) {
      return true;
    }
    return false;
  }

  checkLevelExtraConditions() {
    if (this._gameStatus.over) {
      return;
    }
    if (this.levels?.[this._level] && this.levels[this._level].extraConditions?.length) {
      this.levels[this._level].extraConditions!.forEach((extra) => {
        extra({
          figures: this.figures,
          boards: this.boards,
          nextTurn: this.nextTurn,
        });
      });
    }
  }

  checkConditions() {
    if (this._gameStatus.over) {
      return;
    }
    this.checkLevelExtraConditions();
    if (this.checkIfAccomplished()) {
      const removedBoard = this.boards.shift();
      this.figures = this.figures.filter((f) => f.position?.board != removedBoard?.id);
      if (this._level < this.levels.length - 1) {
        this.loadLevel();
      } else {
        this._gameStatus = {
          over: true,
          status: 'Congratulations!\nYou`ve won this race',
        };
      }
      return;
    }
    this.checkIfFailed();
  }

  loadLevel(index?: number) {
    console.log(this.levels);
    if (!index && index !== 0) {
      index = this._level + 1;
    }
    if (!this.levels?.length || this.levels.length - 1 < index) {
      this._gameStatus = { over: true, status: 'No more levels to play' };
      return;
    }
    this.boards.push(...this.levels[index].boards);
    this.figures.push(...this.levels[index].figures);
    this._gameStatus.status = this.levels[index].objectives || '';
    this._level = index;
    this.checkConditions();
    this.onUpdate(this._moveCount);
  }

  makeAResponse() {
    const afterEstimation = (estimation: Estimation | null) => {
      if (!estimation || estimation.length < 1) {
        this._gameStatus = { over: true, status: 'This looks like a mate' };
        return;
      }
      estimation.sort((a, b) => b.move.points - a.move.points);
      const theFigure = estimation[0].figure;
      const theMove = estimation[0].move;
      this.makeAMove(theFigure, theMove.position);
    };

    // if (window.Worker) {
    //   const estimationWorker = new Worker(
    //     new URL('./workers/estimationWorker.ts', import.meta.url)
    //   );

    //   estimationWorker.onmessage = (e: MessageEvent<Estimation | null>) => {
    //     console.log('Message received from worker', e.data);
    //     const result = e.data;
    //     afterEstimation(result);
    //     // estimationWorker.terminate();
    //   };

    //   estimationWorker.postMessage({
    //     figures: this.figures,
    //     boards: this.boards,
    //     color: this._nextTurn,
    //     depth: 4, // never go higher than 5
    //   });
    // } else {
    const estimation = estimate({
      ...JSON.parse(
        JSON.stringify({
          figures: this.figures,
          boards: this.boards,
          color: this._nextTurn,
          depth: 4, // never go higher than 5
        })
      ),
      /**
       * TODO: make estimate works with deserialized data
       *  */
      figures: this.figures,
      boards: this.boards,
    });
    afterEstimation(estimation);
    // }
  }

  private _notify(message: Message) {
    if (this._onEvent) {
      this._onEvent({ id: Date.now().toString(), ...message });
    }
  }
}
