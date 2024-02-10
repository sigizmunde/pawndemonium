import { Figure } from '@/model/figure';
import { Color, Move } from '@/types';

export function mockTheMove({
  move,
  figure,
  figures,
}: {
  move: Move;
  figure: Figure;
  figures: Figure[];
}) {
  const newFigure = new Figure({
    id: figure.id,
    role: figure.role,
    color: figure.color,
    position: move.position,
  });
  const newFigures = figures.filter((f) => f.id !== figure.id && f.id !== move.kills?.id);
  newFigures.push(newFigure);
  const newColor = figure.color === Color.WHITE ? Color.BLACK : Color.WHITE;
  return { newFigures, newColor };
}
