import { Pers } from '@/components/pers';
import { Color, Role } from '@/types';
import './legend.scss';

export function Legend() {
  const roles = [Role.PAWN, Role.BISHOP, Role.KNIGHT, Role.ROOK, Role.QUEEN, Role.KING];

  return (
    <div className="legend-wrapper">
      {roles.map((role) => (
        <div className="legend-row" key={role}>
          <div className="figure-holder">
            <Pers
              id={`legend-black-${role}`}
              role={role}
              color={Color.BLACK}
              onFigureClick={() => {}}
              cell={[0, 0]}
            />
          </div>
          {role}
          <div className="figure-holder">
            <Pers
              id={`legend-white-${role}`}
              role={role}
              color={Color.WHITE}
              onFigureClick={() => {}}
              cell={[0, 0]}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
