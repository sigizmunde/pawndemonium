import { EstimationArgs } from '@/controller/estimate';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, Estimation, Move, Position, Role, SpaceMatrix } from '@/types';

type DeserializedFigure = {
  _id: string;
  role: Role;
  _color: Color;
  position: Position;
};

type DeserializedBoard = {
  _id: string;
  _space: SpaceMatrix;
};

export type WorkerInputData = {
  figures: DeserializedFigure[];
  boards: DeserializedBoard[];
  color: Color;
  depth?: number;
};

export function convertInputData(inputArgs: WorkerInputData): EstimationArgs {
  const figures = inputArgs.figures?.map(
    ({ _id, role, _color, position }) =>
      new Figure({
        id: _id,
        role,
        color: _color,
        position,
      })
  );
  const boards = inputArgs.boards.map(
    ({ _id, _space }) => new Board({ id: _id, space: _space })
  );
  return { ...inputArgs, figures, boards };
}

export type WorkerOutputMessage = {
  figure: DeserializedFigure;
  move: Move;
  prohibited: boolean;
  estimation: Estimation;
}[];

export function convertOutputMessage(inputArgs: WorkerOutputMessage): Estimation {
  const convertedEstimation = inputArgs.map(
    ({ figure: { _id, role, _color, position }, ...rest }) => ({
      figure: new Figure({
        id: _id,
        role,
        color: _color,
        position,
      }),
      ...rest,
    })
  );
  return convertedEstimation;
}
