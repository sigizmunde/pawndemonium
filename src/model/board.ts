import { Cell, Message, SpaceMatrix } from "@/types";
import { Figure } from "./figure";

export class Board {
    private _id: string;
    private _space: SpaceMatrix;
    figures: Figure[] = [];
    private _onEvent: Function | undefined;

    constructor({id, space, onEvent}: {id: string, space: SpaceMatrix, onEvent: Function | undefined}) {
        this._id = id;
        this._space = space;
    }

    get id() {
        return this._id;
    }

    get space() {
        return this._space;
    }

    withdrawFigure(figure: Figure) {
        this.figures = this.figures.filter(({id}) => id !== figure.id);
    }

    enterFigure(figure: Figure, cell: Cell) {
        const existingFigure = this.checkCell(cell);
        if (existingFigure) {
            existingFigure.kill();
            this.withdrawFigure(existingFigure);
            this._notify({ sender: {type: 'board', id: this._id}, message: `${existingFigure.color} ${existingFigure.role} was killed by ${figure.color} ${figure.role}` });
        }
        figure.move({ board: this._id, cell });
        this.figures.push(figure);
    }

    checkCell(cell: Cell) {
        const figure = this.figures.find(({position}) => position?.cell[0] === cell[0] && position?.cell[1] === cell[1]);
        return figure || null;
    }

    private _notify(message: Message) {
        if (this._onEvent) {
            this._onEvent({id: Date.now().toString(), ...message});
        }
    }
}
