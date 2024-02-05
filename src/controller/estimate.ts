import { getPossibleMoves } from '@/helpers/getPossibleMoves';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { Color, EstimatedMove, Estimation, Move } from '@/types';

type Args = {
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
  depth = 1,
}: Args): Estimation {
  depth -= 1;
  const allies = figures.filter((f) => f.color === color);
  const estimation = allies.reduce<Estimation>((est, fig) => {
    const moves = getPossibleMoves({ boards, figure: fig, figures });
    const estimatedMoves = moves.map<EstimatedMove>((mov) => ({
      figure: fig,
      move: mov,
      evaluation: 1,
      estimation: [],
    }));
    est.push(...estimatedMoves);
    return est;
  }, []);
  if (depth > 0) {
    estimation.forEach(({ figure, move, estimation: innerEstimation }) => {
      const newFigure = new Figure({
        id: figure.id,
        role: figure.role,
        color: figure.color,
        position: move.position,
      });
      const newFigures = figures.filter(
        (f) => f.id !== figure.id && f.id !== move.kills?.id
      );
      newFigures.push(newFigure);
      const newColor = color === Color.WHITE ? Color.BLACK : Color.WHITE;
      innerEstimation.push(
        ...estimate({
          estimatedMove: move,
          figures: newFigures,
          boards,
          color: newColor,
          depth,
        })
      );
    });
  }
  estimation.sort((a, b) => b.move.points - a.move.points);
  if (estimatedMove) {
    estimatedMove.points -= estimation[0]?.move.points || 0;
  }
  return estimation;
}
