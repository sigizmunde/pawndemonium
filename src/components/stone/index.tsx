import { Cell } from '@/types';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import stoneImage from '@/img/stone.gif';

export const Stone: FunctionComponent<{ cell: Cell }> = ({ cell }) => {
  const coordX = (cell[0] * 100) / 8;
  const coordY = (cell[1] * 100) / 8;

  return (
    <div
      className="stone"
      style={{
        left: `${coordX}%`,
        bottom: `${coordY}%`,
      }}
    >
      <Image className="stone-img" src={stoneImage} alt="no way here" style={{transform: `rotate(${(cell[0] + cell[1])*90}deg)`}}/>
    </div>
  );
};
