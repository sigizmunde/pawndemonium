'use client';

import './page.scss';
import { Field } from '@/components/field';
import { Color, Move, Position, Role } from '@/types';
import { Pers } from '@/components/pers';
import { Controller } from '@/controller';
import { Board } from '@/model/board';
import { Figure } from '@/model/figure';
import { useEffect, useState } from 'react';
import { Spot } from '@/components/spot';

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
const blackRook = new Figure({
  id: 'rook1b',
  role: Role.ROOK,
  color: Color.BLACK,
  position: { board: '0007', cell: [0, 7] },
});
const whiteBishop = new Figure({
  id: 'bishop1w',
  role: Role.BISHOP,
  color: Color.WHITE,
  position: { board: '0008', cell: [4, 2] },
});
const blackBishop = new Figure({
  id: 'bishop1b',
  role: Role.BISHOP,
  color: Color.BLACK,
  position: { board: '0008', cell: [3, 0] },
});
controller.figures = [pawn1, pawn2, blackQueen, blackPawn1, blackPawn2, blackRook, whiteBishop, blackBishop];

export default function Home() {
  const [selected, setSelected] = useState<Figure | null>(null);
  const [highlighted, setHighlighted] = useState<Move[]>([]);

  useEffect(() => {
    console.log(highlighted);
  }, [highlighted])

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
  }, [selected]);

  return (
    <main className="main">
      {controller.boards.toReversed().map((b) => (
        <Field key={b.id} id={b.id}>
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
                selected={!!selected && selected.id === f.id}
              />
            ))}
          {highlighted
            .filter((s) => s.position.board === b.id)
            .map((s, i) => (
              <Spot key={i} cell={s.position.cell} onSpotClick={() => handleCellClick(s.position)} />
            ))}
        </Field>
      ))}
    </main>
  );
}
