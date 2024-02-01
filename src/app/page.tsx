'use client';

import './page.scss';
import { Field } from '@/components/field';
import { Color, Position, Role } from '@/types';
import { Pers } from '@/components/pers';
import { Controller } from '@/controller';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { useState } from 'react';

const controller = new Controller();
const newBoard = new Board({
  id: '0007',
  space: Array(8).fill(Array(8).fill(true)),
});
const newBoard2 = new Board({
  id: '0008',
  space: Array(8).fill(Array(8).fill(true)),
});
controller.boards = [newBoard, newBoard2];
const pawn1 = new Figure({
  id: 'pawn1',
  role: Role.PAWN,
  color: Color.WHITE,
  position: { board: '0007', cell: [3, 0] },
});
const pawn2 = new Figure({
  id: 'pawn2',
  role: Role.PAWN,
  color: Color.WHITE,
  position: { board: '0007', cell: [4, 0] },
});
const blackPawn1 = new Figure({
  id: 'pawn1b',
  role: Role.PAWN,
  color: Color.BLACK,
  position: { board: '0007', cell: [3, 7] },
});
const blackPawn2 = new Figure({
  id: 'pawn2b',
  role: Role.PAWN,
  color: Color.BLACK,
  position: { board: '0008', cell: [4, 6] },
});
const blackQueen = new Figure({
  id: 'q1b',
  role: Role.QUEEN,
  color: Color.BLACK,
  position: { board: '0008', cell: [3, 4] },
});
controller.figures = [pawn1, pawn2, blackQueen, blackPawn1, blackPawn2];

export default function Home() {
  const [selected, setSelected] = useState<Figure | null>(null);

  const handleCellClick = (position: Position) => {
    if (selected) {
      controller.makeAMove(selected, position);
      setSelected(null);
    } else {
      const figure = controller.findFigureInCell(position);
      setSelected(figure || null);
    }
  };

  const handleFigureClick = (id: string) => {
    const figure = controller.figures.find((f) => f.id === id);
    if (selected && figure?.position) {
      controller.makeAMove(selected, figure.position);
      setSelected(null);
    } else {
      setSelected(figure || null);
    }
  };

  return (
    <main className="main">
      {controller.boards.toReversed().map((b) => (
        <Field key={b.id} id={b.id} onCellClick={handleCellClick}>
          {controller.figures
            .filter((f) => f.position?.board === b.id)
            .map((f) => (
              <Pers
                key={f.id}
                id={f.id}
                color={f.color}
                role={f.role}
                cell={f.position!.cell}
                onFigureClick={handleFigureClick}
              />
            ))}
        </Field>
      ))}
    </main>
  );
}
