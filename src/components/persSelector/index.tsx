import { Pers } from '@/components/pers';
import { Color, Role } from '@/types';
import './persSelector.scss';

export function PersSelector(props: { onSelect: (color: Color, role: Role) => any }) {
  const roles = [Role.PAWN, Role.BISHOP, Role.KNIGHT, Role.ROOK, Role.QUEEN, Role.KING];

  return (
    <div className="pers-selector-wrapper">
      {roles.map((role) => (
        <div className="pers-selector-block" key={role}>
          <div className="figure-pair">
            <div className="figure-holder">
              <Pers
                id={`selector-black-${role}`}
                role={role}
                color={Color.BLACK}
                onFigureClick={() => props.onSelect(Color.BLACK, role)}
                cell={[0, 0]}
              />
            </div>
            <div className="figure-holder">
              <Pers
                id={`selector-white-${role}`}
                role={role}
                color={Color.WHITE}
                onFigureClick={() => props.onSelect(Color.WHITE, role)}
                cell={[0, 0]}
              />
            </div>
          </div>
          {role}
        </div>
      ))}
    </div>
  );
}
