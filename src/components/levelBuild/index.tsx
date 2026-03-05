'use-client';

import { useEffect, useState } from 'react';
import { FieldWrapper } from '../fieldWrapper';
import { Field } from '../field';
import {
  ConditionFrame,
  LevelConcept,
  Position,
  StaticBoard,
  StaticFigure,
} from '@/types';
import { Pers } from '../pers';
import { Spot } from '../spot';
import { isEqualPosition } from '@/helpers/isEqual';
import Popover from '../popover';
import Modal from '../modal';
import LevelBuildAddFigure from '../levelBuildAddFigure';
import LevelBuildEditObjectives from '../levelBuildEditObjectives';
import { Objectives } from '../objectives';
import './levelBuild.scss';
import LevelBuildConditions from '../levelBuildConditions';

/**
 * for now win conditions in each Level are used to proceed to the next one, if the level is the last in a series, win conditions define the victory
 */
export default function LevelBuild({
  onDeleteLevel,
  onSetActive,
  active,
  staticBoards,
  onSetStaticBoards,
  staticFigures,
  onSetStaticFigures,
  levelObjectives,
  onSetLevelObjectives,
  accomplishedChecks,
  failedChecks,
  extraChecks = undefined,
  onSetAccomplishedChecks,
  onSetFailedChecks,
  onSetExtraChecks = undefined,
}: {
  onDeleteLevel: Function;
  active: boolean;
  onSetActive: Function;
  staticBoards: StaticBoard[];
  onSetStaticBoards: (boards: StaticBoard[]) => any;
  staticFigures: StaticFigure[];
  onSetStaticFigures: (figures: StaticFigure[]) => any;
  levelObjectives: string | null | undefined;
  onSetLevelObjectives: (objectives: string) => any;
  accomplishedChecks: ConditionFrame[][];
  failedChecks: ConditionFrame[][];
  extraChecks?: ConditionFrame[][];
  onSetAccomplishedChecks: (checks: ConditionFrame[][]) => any;
  onSetFailedChecks: (checks: ConditionFrame[][]) => any;
  onSetExtraChecks?: (checks: ConditionFrame[][]) => any;
}) {
  // JSON parse trick to make levelConcept immutable
  const levelBoards: StaticBoard[] = JSON.parse(JSON.stringify(staticBoards));
  const levelFigures: StaticFigure[] = JSON.parse(JSON.stringify(staticFigures));

  const [selected, setSelected] = useState<StaticFigure | null | undefined>(null);
  const [stoneSelected, setStoneSelected] = useState<Position>();
  const [highlighted, setHighlighted] = useState<Position>();
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [addingFigure, setAddingFigure] = useState<boolean>(false);
  const [editingObjectives, setEditingObjectives] = useState<boolean>(false);
  const [editingConditions, setEditingConditions] = useState<boolean>(false);

  useEffect(() => {
    if (!active) {
      setSelected(null);
      setStoneSelected(undefined);
      setHighlighted(undefined);
    }
  }, [active]);

  const handleCellClick = (position: Position) => {
    setHighlighted(position);
    setSelected(null);
    setStoneSelected(undefined);
  };

  const handleSpotClick = () => {
    setHighlighted(undefined);
  };

  const handleStoneClick = (position: Position) => {
    setStoneSelected(position);
    setSelected(null);
    setHighlighted(undefined);
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
      setStoneSelected(undefined);
      setHighlighted(undefined);
    }
  };

  const handleDelete = () => {
    onDeleteLevel();
  };

  const handleOpenAddFigure = () => {
    setAddingFigure(true);
  };

  const handleOpenEditObjectives = () => {
    setEditingObjectives(true);
  };

  const handleOpenEditConditions = () => {
    setEditingConditions(true);
  };

  const handleFigureAdd = (newFigure: StaticFigure) => {
    const filtered = levelFigures.filter(
      (fig) => !isEqualPosition(fig.position || null, newFigure.position || null)
    );
    onSetStaticFigures([...filtered, newFigure]);
  };

  const handleUpdateObjectives = (newObjectives: string) => {
    onSetLevelObjectives(newObjectives);
  };

  const handleUnselectAndCloseAll = () => {
    setClickPos(null);
    setHighlighted(undefined);
    setAddingFigure(false);
    setSelected(null);
    setStoneSelected(undefined);
    setEditingObjectives(false);
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

  const handleRemoveBlockCell = () => {
    const index = levelBoards.findIndex((board) => board.id === stoneSelected?.board);
    if (index > -1 && stoneSelected?.cell) {
      levelBoards[index].space[stoneSelected.cell[0]][stoneSelected.cell[1]] = true;
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
              onStoneClick={handleStoneClick}
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
              {active && highlighted?.board === b.id && (
                <Spot onSpotClick={handleSpotClick} cell={highlighted.cell} />
              )}
            </Field>
          </FieldWrapper>
        ))}
        <Objectives
          info={levelObjectives || 'no objectives for this level yet'}
          showByDefault={false}
        />
        <div className="edit-level-block">
          <button type="button" className="gapped-button" onClick={handleDelete}>
            Remove level
          </button>
          <button
            type="button"
            className="gapped-button"
            onClick={handleOpenEditConditions}
          >
            Edit conditions
          </button>
          <button
            type="button"
            className="gapped-button"
            onClick={handleOpenEditObjectives}
          >
            Edit objectives
          </button>
        </div>
      </div>
      {active && clickPos && (highlighted || selected || stoneSelected) && (
        <Popover x={clickPos.x} y={clickPos.y}>
          <div className="vertical-menu">
            {!stoneSelected && (
              <button
                type="button"
                className="gapped-button"
                onClick={handleOpenAddFigure}
              >
                {highlighted ? 'add figure' : 'change figure'}
              </button>
            )}
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
            {stoneSelected && (
              <button
                type="button"
                className="gapped-button"
                onClick={handleRemoveBlockCell}
              >
                unblock cell
              </button>
            )}
          </div>
        </Popover>
      )}
      {addingFigure && (highlighted || selected?.position) && (
        <Modal>
          <LevelBuildAddFigure
            position={highlighted || selected?.position!}
            onFigureAdd={handleFigureAdd}
            onClose={handleUnselectAndCloseAll}
          />
        </Modal>
      )}
      {editingObjectives && (
        <Modal>
          <LevelBuildEditObjectives
            currentObjectives={levelObjectives || ''}
            onSave={handleUpdateObjectives}
            onClose={handleUnselectAndCloseAll}
          />
        </Modal>
      )}
      {editingConditions && (
        <Modal>
          <LevelBuildConditions
            accomplishedChecks={accomplishedChecks}
            failedChecks={failedChecks}
            extraChecks={extraChecks}
            onSetAccomplishedChecks={onSetAccomplishedChecks}
            onSetFailedChecks={onSetFailedChecks}
            onSetExtraChecks={onSetExtraChecks}
            onClose={() => setEditingConditions(false)}
          />
        </Modal>
      )}
    </>
  );
}
