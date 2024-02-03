'use client';

import React, { FunctionComponent, MouseEventHandler, ReactNode } from 'react';
import darkCell from '@/img/darkcell.gif';
import lightCell from '@/img/lightcell.gif';

type FieldProps = {
  id: string;
  children?: ReactNode;
  onCellClick?: Function;
};

export const Field: FunctionComponent<FieldProps> = ({
  id,
  children = undefined,
  onCellClick = () => {},
}) => {
  const handleClick = (x: number, y: number) => {
    onCellClick({ board: id, cell: [x, y] });
  };

  return (
    <div className="field">
      {Array(8)
        .fill(1)
        .map((_, y) => (
          <div key={y} className="field-row">
            {Array(8)
              .fill(1)
              .map((__, x) => (
                <div
                  key={x + '' + y}
                  className="field-cell"
                  style={{
                    backgroundColor: '#6d6358',
                    backgroundImage: `url(${(x + y) % 2 ? darkCell.src : lightCell.src})`,
                    backgroundSize: 'cover',
                    imageRendering: 'pixelated',
                  }}
                  onClick={() => handleClick(x, y)}
                >
                  {' '}
                  {x} {y}{' '}
                </div>
              ))}
          </div>
        ))
        .reverse()}
      {children}
    </div>
  );
};
