'use client';

import { FormEvent, useState } from 'react';
import { Color, Position, Role, StaticFigure } from '@/types';

type AddFigureProps = {
  position: Position;
  onFigureAdd: (figure: StaticFigure) => any;
  onClose: (props?: any) => any;
};

export default function LevelBuildAddFigure(props: AddFigureProps) {
  const [color, setColor] = useState(Color.WHITE);
  const [role, setRole] = useState(Role.PAWN);

  const onConfirm = (e: FormEvent) => {
    e.preventDefault();
    const newFigure: StaticFigure = {
      id: crypto.randomUUID(),
      role,
      color,
      position: props.position,
    };
    props.onFigureAdd(newFigure);
    props.onClose();
  };

  return (
    <form onSubmit={onConfirm}>
      <h5>Adding a figure</h5>
      <label>
        Color
        <select value={color} onChange={(e) => setColor(e.target.value as Color)}>
          {Object.values(Color).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        Role
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          {Object.values(Role).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <button className="gapped-button" type="submit">
        Add
      </button>
      <button className="gapped-button" type="button" onClick={props.onClose}>
        Cancel
      </button>
    </form>
  );
}
