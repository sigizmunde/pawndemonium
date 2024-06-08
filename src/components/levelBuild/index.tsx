'use-client';

import { useEffect, useState } from 'react';
import { FieldWrapper } from '../fieldWrapper';
import { Field } from '../field';
import { Board } from '@/model/board';
import { LevelConcept, Position, StaticFigure } from '@/types';
import { Pers } from '../pers';
import { Spot } from '../spot';
import { isEqualPosition } from '@/helpers/isEqual';
import Popover from '../popover';
import './levelBuild.scss';
import Modal from '../modal';
import LevelBuildAddFigure from '../levelBuildAddFigure';

export default function LevelBuild(props: {
  levelConcept: LevelConcept;
  onSave: (editedConcept: LevelConcept) => any;
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
  const [addingFigure, setAddingFigure] = useState<boolean>(false);

  const handleSaveLevel = () => {
    const editedLevel = {
      ...levelConcept,
      boards,
      staticFigures
    }
    onSave(editedLevel);
  }

  const handleCellClick = (position: Position) => {
    setHighlighted(position);
    setSelected(null);
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
      setHighlighted(undefined);
    }
  };

  const handleDelete = () => {
    onDelete(levelConcept.id);
  };

  const handleOpenAddFigure = () => {
    setAddingFigure(true);
  };

  const handleFigureAdd = (newFigure: StaticFigure) => {
    setStaticFigures((prev) => {
      const filtered = prev.filter(
        (fig) => !isEqualPosition(fig.position || null, newFigure.position || null)
      );
      return [...filtered, newFigure];
    });
  };

  const handleUnselectAndCloseAll = () => {
    setClickPos(null);
    setHighlighted(undefined);
    setAddingFigure(false);
  };

  return (
    <>
      <div className="level-build-wrapper" onClick={handleClickLevel}>
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
          <button type="button" className="gapped-button" onClick={handleDelete}>
            Remove level
          </button>
          <button type="button" className="gapped-button" onClick={handleSaveLevel}>
            Save level
          </button>
        </div>
      </div>
      {active && clickPos && (highlighted || selected) && (
        <Popover x={clickPos.x} y={clickPos.y}>
          <button type="button" className="gapped-button" onClick={handleOpenAddFigure}>
              {highlighted ? 'add figure' : 'change figure'}
          </button>
        </Popover>
      )}
      {addingFigure && (highlighted || selected?.position) && (
        <Modal onClose={() => setAddingFigure(false)}>
          <LevelBuildAddFigure
            position={highlighted || selected?.position!}
            onFigureAdd={handleFigureAdd}
            onClose={handleUnselectAndCloseAll}
          />
        </Modal>
      )}
    </>
  );
}
