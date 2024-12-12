import { Cell } from '@/types';
import Image from 'next/image';
import { FunctionComponent, MouseEventHandler } from 'react';
import stoneImage from '@/img/stone.gif';
import './stone.scss';

export const Stone: FunctionComponent<{
  cell: Cell;
  onClick?: MouseEventHandler<HTMLDivElement>;
}> = ({ cell, onClick = () => {} }) => {
  const coordX = (cell[0] * 100) / 8;
  const coordY = (cell[1] * 100) / 8;

  return (
    <div
      className="stone"
      style={{
        left: `${coordX}%`,
        bottom: `${coordY}%`,
      }}
      onClick={onClick}
    >
      <Image
        className="stone-img"
        src={stoneImage}
        alt="no way here"
        style={{ transform: `rotate(${(cell[0] + cell[1]) * 90}deg)` }}
      />
    </div>
  );
};
