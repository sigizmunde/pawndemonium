'use client';

import { Field } from '@/components/field';
import { Color, Move, Position } from '@/types';
import { Pers } from '@/components/pers';
import { Figure } from '@/model/figure';
import { useCallback, useEffect, useState } from 'react';
import { Spot } from '@/components/spot';
import { Controller } from '@/controller';
import { levels } from '@/levels';
import { FieldWrapper } from '@/components/fieldWrapper';
import { Loader } from '@/components/loader';
import { Legend } from '@/components/legend';

export default function Game({ controller }: { controller: Controller }) {
  const [selected, setSelected] = useState<Figure | null>(null);
  const [highlighted, setHighlighted] = useState<Move[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const { gameStatus, nextTurn } = controller;

  useEffect(() => {
    if (
      controller.boards.length > 0 &&
      controller.figures.length > 0 &&
      nextTurn === Color.WHITE
    ) {
      controller.makeAResponse();
    }
  }, [nextTurn, controller]);

  const handleUpdate = useCallback(
    (tick: number) => {
      setCounter(tick);
    },
    [setCounter]
  );

  useEffect(() => {
    controller.onUpdate = handleUpdate;
  }, [controller, handleUpdate]);

  useEffect(() => {
    if (controller.levels.length < 1) {
      controller.levels = [...levels];
      controller.loadLevel(0);
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
    if (figure?.color === nextTurn) {
      setSelected(figure || null);
    }
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
        <FieldWrapper key={b.id}>
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
        </FieldWrapper>
      ))}
      <Legend />
      <div className="objectives">
        {gameStatus.status.split('\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {gameStatus.over && <div className="game-over"> {gameStatus.status} </div>}
      {nextTurn === Color.WHITE && <Loader />}
    </main>
  );
}
