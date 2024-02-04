'use client';

import { Field } from '@/components/field';
import { Move, Position } from '@/types';
import { Pers } from '@/components/pers';

import { Figure } from '@/model/figure';
import { useEffect, useState } from 'react';
import { Spot } from '@/components/spot';
import { Controller } from '@/controller';
import { levels } from '@/levels';

export default function Game({ controller }: { controller: Controller }) {
  const [selected, setSelected] = useState<Figure | null>(null);
  const [highlighted, setHighlighted] = useState<Move[]>([]);

  useEffect(() => {
    if (controller.levels.length < 1) {
      controller.boards = levels[0].boards;
      controller.figures = levels[0].figures;
    }
  }, [controller]);

  const handleCellClick = (position: Position) => {
    if (selected) {
      controller.makeAMove(selected, position);
      setSelected(null);
    }
  };

  const handleFigureClick = (id: string) => {
    const figure = controller.figures.find((f) => f.id === id);
    setSelected(figure || null);
  };

  useEffect(() => {
    if (selected?.position) {
      setHighlighted(controller.getFigureMoves(selected));
    }
    if (!selected) {
      setHighlighted([]);
    }
  }, [selected, controller]);

  const deselect = () => setSelected(null);

  return (
    <main className="main">
      {[...controller.boards].reverse().map((b) => (
        <Field key={b.id} id={b.id} matrix={b.space} onCellClick={deselect}>
          {...controller.figures
            .filter((f) => f.position?.board === b.id)
            .map((f) => (
              <Pers
                key={f.id}
                id={f.id}
                color={f.color}
                role={f.role}
                cell={f.position!.cell}
                onFigureClick={handleFigureClick}
                selected={!!selected && selected.id === f.id}
              />
            ))}
          {highlighted
            .filter((s) => s.position.board === b.id)
            .map((s, i) => (
              <Spot
                key={i}
                cell={s.position.cell}
                onSpotClick={() => handleCellClick(s.position)}
              />
            ))}
        </Field>
      ))}
    </main>
  );
}
