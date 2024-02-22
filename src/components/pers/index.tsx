'use client';

import { Cell, Color, Role } from '@/types';
import React, { FunctionComponent } from 'react';
import Image from 'next/image';
import pawnImage from '@/img/pawn.gif';
import knightImage from '@/img/knight.gif';
import bishopImage from '@/img/bishop.gif';
import rookImage from '@/img/rook.gif';
import queenImage from '@/img/queen.gif';
import kingImage from '@/img/king.gif';
import wpawnImage from '@/img/wpawn.gif';
import wknightImage from '@/img/wknight.gif';
import wbishopImage from '@/img/wbishop.gif';
import wrookImage from '@/img/wrook.gif';
import wqueenImage from '@/img/wqueen.gif';
import wkingImage from '@/img/wking.gif';
import selectedImage from '@/img/select.gif';
import './pers.scss';

type PersProps = {
  id: string;
  color: Color;
  role: Role;
  onFigureClick: Function;
  cell: Cell;
  selected?: boolean;
};

const persMap = {
  [Role.PAWN]: { black: pawnImage, white: wpawnImage },
  [Role.KNIGHT]: { black: knightImage, white: wknightImage },
  [Role.BISHOP]: { black: bishopImage, white: wbishopImage },
  [Role.ROOK]: { black: rookImage, white: wrookImage },
  [Role.QUEEN]: { black: queenImage, white: wqueenImage },
  [Role.KING]: { black: kingImage, white: wkingImage },
};

export const Pers: FunctionComponent<PersProps> = ({
  id,
  color,
  role,
  onFigureClick,
  cell,
  selected = false,
}) => {
  const pers = persMap[role];
  const hexColor = color === Color.BLACK ? '#111' : '#DDD';
  const colorDescriptor = color === Color.BLACK ? 'black' : 'white';
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
        width: 'var(--cell-size)',
        height: 'var(--cell-size)',
        zIndex: 1,
        backgroundImage: selected ? `url(${selectedImage.src})` : undefined,
      }}
    >
      <button
        type="button"
        className="pers-button"
        style={{ color: hexColor }}
        onClick={handleClick}
      >
        <Image
          className="pers-img"
          src={pers[colorDescriptor]}
          alt={`${colorDescriptor} ${role}`}
        />
        <div
          className="pers-animated"
          style={{
            position: 'absolute',
            width: 'var(--cell-size)',
            height: 'var(--cell-size)',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
          }}
        />
      </button>
    </div>
  );
};
