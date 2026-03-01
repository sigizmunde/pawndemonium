'use client';

import { Color, Position, Role, StaticFigure } from '@/types';
import { PersSelector } from '../persSelector';
import './levelBuildAddFigure.scss';

type AddFigureProps = {
  position: Position;
  onFigureAdd: (figure: StaticFigure) => any;
  onClose: (props?: any) => any;
};

export default function LevelBuildAddFigure(props: AddFigureProps) {
  const onSelect = (color: Color, role: Role) => {
    const newFigure: StaticFigure = {
      id: crypto.randomUUID(),
      role,
      color,
      position: props.position,
    };
    props.onFigureAdd(newFigure);
    props.onClose();
  };

  return (
    <div className="level-build-add-figure-wrapper">
      <h5>Adding a figure</h5>
      <PersSelector onSelect={onSelect} />
      <button className="gapped-button" type="button" onClick={props.onClose}>
        Cancel
      </button>
    </div>
  );
}
