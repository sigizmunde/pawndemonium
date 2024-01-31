'use client'

import "./page.scss";
import { Field } from "@/components/field";
import { Color, Role } from "@/types";
import { Pers } from "@/components/pers";
import { Controller } from "@/controller";
import { Board } from "@/model/board";
import { Figure } from "@/model/figure";

const controller = new Controller();
const newBoard = new Board({ id: '0007', space: Array(8).fill(Array(8).fill(true)) });
const newBoard2 = new Board({ id: '0008', space: Array(8).fill(Array(8).fill(true)) });
controller.boards = [newBoard, newBoard2];
const pawn1 = new Figure({ id: 'pawn1', role: Role.PAWN, color: Color.WHITE, position: { board: '0007', cell: [0, 3] } });
const pawn2 = new Figure({ id: 'pawn2', role: Role.PAWN, color: Color.WHITE, position: { board: '0007', cell: [0, 4] } });
const blackPawn1 = new Figure({ id: 'pawn1b', role: Role.PAWN, color: Color.BLACK, position: { board: '0007', cell: [7, 3] } });
const blackPawn2 = new Figure({ id: 'pawn2b', role: Role.PAWN, color: Color.BLACK, position: { board: '0008', cell: [6, 4] } });
const blackQueen = new Figure({ id: 'q1b', role: Role.QUEEN, color: Color.BLACK, position: { board: '0008', cell: [4, 3] } });
controller.figures = [pawn1, pawn2, blackQueen, blackPawn1, blackPawn2];

export default function Home() {
  return (
    <main className="main">
      {controller.boards.toReversed().map((b) =>
        <Field key={b.id} id={b.id}>
          {controller.figures.filter((f) => f.position?.board === b.id).map((f) =>
            <Pers key={f.id} id={f.id} color={f.color} role={f.role} cell={f.position!.cell} onClick={() => { }} />
          )}
        </Field>)}
    </main>
  );
}
