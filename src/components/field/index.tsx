'use client';

import React, { FunctionComponent, MouseEventHandler, ReactNode } from 'react';

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
                  style={{ backgroundColor: (x + y) % 2 ? '#eee' : '#aaa' }}
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
