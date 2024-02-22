'use client';

import React, { Fragment, FunctionComponent, MouseEventHandler, ReactNode } from 'react';
import darkCell from '@/img/darkcell.gif';
import lightCell from '@/img/lightcell.gif';
import { SpaceMatrix } from '@/types';
import { Stone } from '../stone';
import './field.scss';

type FieldProps = {
  id: string;
  matrix?: SpaceMatrix;
  children?: ReactNode;
  onCellClick?: Function;
};

export const Field: FunctionComponent<FieldProps> = ({
  id,
  children = undefined,
  onCellClick = () => {},
  matrix = Array(8).fill(Array(8).fill(true)),
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
                />
              ))}
          </div>
        ))
        .reverse()}
      {matrix.map((column, i) =>
        [...column]
          .map((open, j) => !open && <Stone key={i + '' + j} cell={[i, j]} />)
      )}
      {/* borders */}
      {Array(8).fill(true).map((_, index) => <Fragment key={index}><Stone cell={[-1, index]}/><Stone cell={[8, index]}/></Fragment>)}
      {children}
    </div>
  );
};
