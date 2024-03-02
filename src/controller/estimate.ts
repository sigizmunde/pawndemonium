import { getPossibleMoves } from '@/helpers/getPossibleMoves';
import { mockTheMove } from '@/helpers/mockTheMove';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, EstimatedMove, Estimation, Move, Role } from '@/types';

export type EstimationArgs = {
  estimatedMove?: Move;
  figures: Figure[];
  boards: Board[];
  color: Color;
  depth?: number;
};

export function estimate({
  estimatedMove,
  figures,
  boards,
  color,
  depth = 2,
  // depth < 2 will not give the estimation
}: EstimationArgs): Estimation | null {
  depth -= 1;
  const allies = figures.filter((f) => f.color === color);
  const estimation = allies.reduce<Estimation>((est, fig) => {
    const moves = getPossibleMoves({ boards, figure: fig, figures });
    const estimatedMoves = moves.map<EstimatedMove>((mov) => ({
      figure: fig,
      move: mov,
      estimation: [],
    }));
    est.push(...estimatedMoves);
    return est;
  }, []);

  // check if the king is under attack after the parent move
  const isCheck = estimation.some(
    ({ move }) => move.kills && move.kills.role === Role.KING
  );
  if (isCheck) {
    // if this is not the first iteration
    if (estimatedMove) {
      estimatedMove.points -= 100000;
      return null;
    } else {
      // if this is first iteration
      console.log('possibly, mate');
    }
  }

  // iteration starts here
  if (depth > 0) {
    estimation.reduce<Estimation>((accumulator, { figure, move }) => {
      // perform a potential move -- change a set of figures and positions
      const { newFigures, newColor } = mockTheMove({ move, figure, figures });
      // get estimation for current estimated move
      const currentEstimation = estimate({
        estimatedMove: move,
        figures: newFigures,
        boards,
        color: newColor,
        depth,
      });
      // add move to the returned array only if the move has estimation
      if (currentEstimation) {
        accumulator.push({ figure, move, estimation: currentEstimation });
      }
      return accumulator;
    }, []);
  }
  // change points for the move that is the parent of this iteration
  const maxPoints = Math.max(...estimation.map(({ move }) => move.points));
  if (estimatedMove) {
    estimatedMove.points -= maxPoints;
  }
  return estimation;
}

export function asyncEstimate({
  estimatedMove,
  figures,
  boards,
  color,
  depth = 2,
  // depth < 2 will not give the estimation
}: EstimationArgs): Promise<Estimation | null> {
  return new Promise((resolve, reject) => {
    try {
      const estimation = estimate({
        estimatedMove,
        figures,
        boards,
        color,
        depth,
      });
      resolve(estimation);
    } catch {
      reject(null);
    }
  });
}
