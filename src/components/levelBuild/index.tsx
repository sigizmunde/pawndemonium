'use-client';

import { useState } from 'react';
import { FieldWrapper } from '../fieldWrapper';
import { Field } from '../field';
import { Board } from '@/model/board';
import { LevelConcept, Position, StaticFigure } from '@/types';
import { Pers } from '../pers';
import { Spot } from '../spot';
import { isEqualPosition } from '@/helpers/isEqual';
import Popover from '../popover';

export default function LevelBuild(props: {
  levelConcept: LevelConcept;
  onSave: Function;
  onDelete: Function;
  active: boolean;
  onSetActive: Function;
}) {
  const { levelConcept, onSave, onDelete, onSetActive, active } = props;

  const [boards, setBoards] = useState<Board[]>([...levelConcept.boards]);
  const [staticFigures, setStaticFigures] = useState<StaticFigure[]>([
    ...levelConcept.staticFigures,
  ]);
  const [selected, setSelected] = useState<StaticFigure | null | undefined>(null);
  const [highlighted, setHighlighted] = useState<Position>();
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);

  const handleCellClick = (position: Position) => {
    setHighlighted(position);
  };

  const handleClickLevel = (e: React.MouseEvent) => {
    setClickPos({
      x: e.clientX,
      y: e.clientY,
    });
    onSetActive(levelConcept.id);
  };

  const handleFigureClick = (id: string) => {
    if (selected && selected.id === id) {
      setSelected(null);
    } else {
      setSelected(staticFigures.find((sf) => sf.id === id));
    }
  };

  const handleDelete = () => {
    onDelete(levelConcept.id);
  };

  return (
    <>
      <div onClick={handleClickLevel}>
        {boards.reverse().map((b) => (
          <FieldWrapper key={b.id}>
            <Field key={b.id} id={b.id} matrix={b.space} onCellClick={handleCellClick}>
              {staticFigures
                .filter((f) => f.position?.board === b.id)
                .map((f) => (
                  <Pers
                    key={f.id}
                    id={f.id}
                    color={f.color}
                    role={f.role}
                    cell={f.position!.cell}
                    onFigureClick={handleFigureClick}
                    selected={!!selected && selected.id === f.id}
                  />
                ))}
              {active && highlighted?.board === b.id && <Spot cell={highlighted.cell} />}
            </Field>
          </FieldWrapper>
        ))}
        <div className="edit-level-block">
          <button type="button" onClick={handleDelete}>
            Remove level
          </button>
        </div>
      </div>
      {active && clickPos && (
        <Popover x={clickPos.x} y={clickPos.y}>
          popover!
        </Popover>
      )}
    </>
  );
}
