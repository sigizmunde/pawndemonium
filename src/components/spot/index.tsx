import { Cell } from '@/types';
import { FunctionComponent } from 'react';
import './spot.scss';

type SpotProps = {
  onSpotClick?: Function;
  cell: Cell;
};

export const Spot: FunctionComponent<SpotProps> = ({ onSpotClick = () => {}, cell }) => {
  const coordX = (cell[0] * 100) / 8;
  const coordY = (cell[1] * 100) / 8;

  const handleClick = () => {
    onSpotClick();
  };

  return (
    <div
      className="spot"
      style={{
        position: 'absolute',
        left: `${coordX}%`,
        bottom: `${coordY}%`,
        width: 'var(--cell-size)',
        height: 'var(--cell-size)',
        zIndex: 2,
      }}
    >
      <button
        type="button"
        className="spot-button"
        style={{ backgroundColor: '#00aa2255' }}
        onClick={handleClick}
      />
    </div>
  );
};
