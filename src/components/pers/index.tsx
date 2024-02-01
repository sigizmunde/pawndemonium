'use client';

import { Cell, Color, Role } from '@/types';
import React, { FunctionComponent, MouseEventHandler } from 'react';

type PersProps = {
  id: string;
  color: Color;
  role: Role;
  onFigureClick: Function;
  cell: Cell;
};

const persMap = {
  [Role.PAWN]: 'i',
  [Role.KNIGHT]: 'S',
  [Role.BISHOP]: 'I',
  [Role.ROOK]: 'T',
  [Role.QUEEN]: 'W',
  [Role.KING]: '$',
};

export const Pers: FunctionComponent<PersProps> = ({
  id,
  color,
  role,
  onFigureClick,
  cell,
}) => {
  const pers = persMap[role];
  const hexColor = color === Color.BLACK ? '#111' : '#DDD';
  const coordX = (cell[0] * 100) / 8;
  const coordY = (cell[1] * 100) / 8;

  const handleClick = () => {
    onFigureClick(id);
  };

  return (
    <div
      className="pers"
      style={{
        position: 'absolute',
        left: `${coordX}%`,
        bottom: `${coordY}%`,
        width: '6.25vh',
        height: '6.25vh',
      }}
    >
      <button
        type="button"
        className="pers-button"
        style={{ color: hexColor }}
        onClick={handleClick}
      >
        {pers}
      </button>
    </div>
  );
};
