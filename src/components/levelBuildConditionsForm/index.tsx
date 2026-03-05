import { useState } from 'react';
import {
  Color,
  ConditionFrame,
  isPositionPrecursor,
  PositionPrecursor,
  Role,
} from '@/types';
import './levelBuildConditionsForm.scss';

type ConditionsFormProps = {
  conditions: ConditionFrame[][];
  onSubmit: (conditions: ConditionFrame[][]) => any;
  onCancel: () => any;
};

export default function LevelBuildConditionsForm(props: ConditionsFormProps) {
  const { conditions, onSubmit, onCancel } = props;
  const [conditionsState, setConditionsState] = useState(conditions);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(conditionsState);
  };

  return (
    <form className="level-build-condition-form" onSubmit={onFormSubmit}>
      {conditionsState.map((row, rowIndex) => (
        <div key={rowIndex} className="condition-row">
          {row.map((condition, conditionIndex) => (
            <div key={conditionIndex} className="condition-cell">
              - if
              <select
                className="condition-turn-select"
                value={condition.nextTurn}
                onChange={(e) => {
                  const newConditions = [...conditionsState];
                  newConditions[rowIndex][conditionIndex].nextTurn = e.target
                    .value as Color;
                  setConditionsState(newConditions);
                }}
              >
                <option value="white">on White&lsquo;s turn</option>
                <option value="black">on Black&lsquo;s turn</option>
              </select>
              a{' '}
              <select
                className="condition-figure-role-select"
                value={condition.figureSelector.role ?? 'any'}
                onChange={(e) => {
                  const newConditions = [...conditionsState];
                  newConditions[rowIndex][conditionIndex].figureSelector.role =
                    e.target.value === 'any' ? undefined : (e.target.value as Role);
                  setConditionsState(newConditions);
                }}
              >
                {Object.values(Role).map((role) => {
                  return (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  );
                })}
                <option value="any">any</option>
              </select>
              <select
                className="condition-figure-color-select"
                value={condition.figureSelector.color ?? 'any'}
                onChange={(e) => {
                  const newConditions = [...conditionsState];
                  newConditions[rowIndex][conditionIndex].figureSelector.color = e.target
                    .value as Color;
                  setConditionsState(newConditions);
                }}
              >
                <option value="white">white</option>
                <option value="black">black</option>
              </select>
              figure is{' '}
              <div className="condition-description">
                {isPositionPrecursor(condition.conditionPrecursor) ? (
                  <>
                    on position where
                    <select
                      className="pos-type-select"
                      onChange={(e) => {
                        const newConditions = [...conditionsState];
                        const precursor =
                          newConditions[rowIndex][conditionIndex].conditionPrecursor;
                        if (isPositionPrecursor(precursor)) {
                          precursor.condition = e.target
                            .value as PositionPrecursor['condition'];
                          setConditionsState(newConditions);
                        }
                      }}
                    >
                      {/* should explicitly check position for the current board or give an option to choose specific/all boards */}
                      {/* <option value="board">board</option> 
                      not implemented yet */}
                      <option value="row">row</option>
                      <option value="column">column</option>
                    </select>
                    <label>
                      <input type="checkbox" className="pos-negative-select" />
                      not
                    </label>
                    <select
                      className="pos-comparator-select"
                      onChange={(e) => {
                        const newConditions = [...conditionsState];
                        const precursor =
                          newConditions[rowIndex][conditionIndex].conditionPrecursor;
                        if (isPositionPrecursor(precursor)) {
                          precursor.comparator = e.target
                            .value as PositionPrecursor['comparator'];
                          setConditionsState(newConditions);
                        }
                      }}
                    >
                      <option value="eq">equal to</option>
                      <option value="gt">greater than</option>
                      <option value="lt">smaller than</option>
                      {/* <option value="in">within</option> 
                      not implemented yet */}
                    </select>
                    <input
                      type="number"
                      className="pos-value-input"
                      min="1"
                      max="8"
                      onChange={(e) => {
                        const newConditions = [...conditionsState];
                        const value = parseInt(e.target.value);
                        const precursor =
                          newConditions[rowIndex][conditionIndex].conditionPrecursor;
                        // already checked, but just because TS wants so
                        if (isPositionPrecursor(precursor)) {
                          precursor.value = value - 1;
                        }
                        setConditionsState(newConditions);
                      }}
                    />
                  </>
                ) : (
                  <>--new--</>
                )}
              </div>
              <p>--- AND ---</p>
            </div>
          ))}
          <button
            className="gapped-button"
            type="button"
            onClick={() => {
              const newConditions = [...conditionsState];
              newConditions[rowIndex].push({
                nextTurn: Color.WHITE,
                figureSelector: { color: Color.WHITE },
                conditionPrecursor: {
                  condition: 'row',
                  comparator: 'eq',
                  negative: false,
                  value: 0,
                },
              });
              setConditionsState(newConditions);
            }}
          >
            Add condition
          </button>
        </div>
      ))}
      <button
        className="gapped-button"
        type="button"
        onClick={() => {
          const newConditions = [...conditionsState];
          newConditions.push([
            {
              nextTurn: Color.WHITE,
              figureSelector: { color: Color.WHITE },
              conditionPrecursor: {
                condition: 'row',
                comparator: 'eq',
                negative: false,
                value: 0,
              },
            },
          ]);
          setConditionsState(newConditions);
        }}
      >
        Add condition
      </button>
      <button className="gapped-button" type="submit" onClick={onFormSubmit}>
        Submit
      </button>
      <button className="gapped-button" type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
