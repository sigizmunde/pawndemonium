'use-client';

import { useEffect, useState } from 'react';
import { FieldWrapper } from '../fieldWrapper';
import { Field } from '../field';
import { LevelConcept, Position, StaticBoard, StaticFigure } from '@/types';
import { Pers } from '../pers';
import { Spot } from '../spot';
import { isEqualPosition } from '@/helpers/isEqual';
import Popover from '../popover';
import './levelBuild.scss';
import Modal from '../modal';
import LevelBuildAddFigure from '../levelBuildAddFigure';

export default function LevelBuild(props: {
  onDeleteLevel: Function;
  active: boolean;
  onSetActive: Function;
  staticBoards: StaticBoard[];
  onSetStaticBoards: (boards: StaticBoard[]) => any;
  staticFigures: StaticFigure[];
  onSetStaticFigures: (figures: StaticFigure[]) => any;
}) {
  const {
    onDeleteLevel,
    onSetActive,
    active,
    staticBoards,
    onSetStaticBoards,
    staticFigures,
    onSetStaticFigures,
  } = props;

  // JSON parse trick to make levelConcept immutable
  const levelBoards: StaticBoard[] = JSON.parse(JSON.stringify(staticBoards));
  const levelFigures: StaticFigure[] = JSON.parse(JSON.stringify(staticFigures));
  const [selected, setSelected] = useState<StaticFigure | null | undefined>(null);
  const [highlighted, setHighlighted] = useState<Position>();
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [addingFigure, setAddingFigure] = useState<boolean>(false);

  useEffect(() => {
    if (!active) {
      setSelected(null);
      setHighlighted(undefined);
    }
  }, [active]);

  const handleCellClick = (position: Position) => {
    setHighlighted(position);
    setSelected(null);
  };

  const handleClickLevel = (e: React.MouseEvent) => {
    setClickPos({
      x: e.clientX,
      y: e.clientY,
    });
    onSetActive();
  };

  const handleFigureClick = (id: string) => {
    if (active && selected && selected.id === id) {
      setSelected(null);
    } else {
      setSelected(staticFigures.find((sf) => sf.id === id));
      setHighlighted(undefined);
    }
  };

  const handleDelete = () => {
    onDeleteLevel();
  };

  const handleOpenAddFigure = () => {
    setAddingFigure(true);
  };

  const handleFigureAdd = (newFigure: StaticFigure) => {
    const filtered = levelFigures.filter(
      (fig) => !isEqualPosition(fig.position || null, newFigure.position || null)
    );
    onSetStaticFigures([...filtered, newFigure]);
  };

  const handleUnselectAndCloseAll = () => {
    setClickPos(null);
    setHighlighted(undefined);
    setAddingFigure(false);
    setSelected(null);
  };

  const handleFigureRemove = () => {
    onSetStaticFigures(
      levelFigures.filter((fig) => {
        return !isEqualPosition(fig.position || null, selected?.position || null);
      })
    );
    handleUnselectAndCloseAll();
  };

  const handleAddBlockCell = () => {
    const index = levelBoards.findIndex((board) => board.id === highlighted?.board);
    if (index > -1 && highlighted?.cell) {
      levelBoards[index].space[highlighted.cell[0]][highlighted.cell[1]] = false;
      onSetStaticBoards([...levelBoards]);
    }
    handleUnselectAndCloseAll();
  };

  return (
    <>
      <div className="level-build-wrapper" onClick={handleClickLevel}>
        {levelBoards.reverse().map((b) => (
          <FieldWrapper key={b.id}>
            <Field
              key={b.id}
              id={b.id}
              matrix={b.space}
              onCellClick={handleCellClick}
              onStoneClick={() => {}}
            >
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
        </div>
      </div>
      {active && clickPos && (highlighted || selected) && (
        <Popover x={clickPos.x} y={clickPos.y}>
          <div className="vertical-menu">
            <button type="button" className="gapped-button" onClick={handleOpenAddFigure}>
              {highlighted ? 'add figure' : 'change figure'}
            </button>
            {highlighted && (
              <button
                type="button"
                className="gapped-button"
                onClick={handleAddBlockCell}
              >
                block cell
              </button>
            )}
            {selected && (
              <button
                type="button"
                className="gapped-button"
                onClick={handleFigureRemove}
              >
                remove figure
              </button>
            )}
          </div>
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
