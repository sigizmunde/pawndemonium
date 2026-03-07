import { useEffect, useState } from 'react';
import { AttackPrecursor, Color, ConditionFrame, PositionPrecursor, Role } from '@/types';
import './levelBuildConditionsForm.scss';

type ConditionsFormProps = {
  conditions: ConditionFrame[][];
  onSubmit: (conditions: ConditionFrame[][]) => any;
  onCancel: () => any;
};

export default function LevelBuildConditionsForm(props: ConditionsFormProps) {
  console.log('rendering conditions form with conditions', props.conditions);
  const { conditions, onSubmit, onCancel } = props;
  const [conditionsState, setConditionsState] = useState(conditions);

  useEffect(() => {
    setConditionsState(conditions);
  }, [conditions]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(conditionsState);
  };

  return (
    <form className="level-build-condition-form" onSubmit={onFormSubmit}>
      <div className="form-content">
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
                    newConditions[rowIndex][conditionIndex].figureSelector.color = e
                      .target.value as Color;
                    setConditionsState(newConditions);
                  }}
                >
                  <option value="white">white</option>
                  <option value="black">black</option>
                </select>
                figure{' '}
                <div className="condition-description">
                  <label>
                    <input
                      type="checkbox"
                      className="position-condition-checkbox"
                      checked={!!condition.positionCondition}
                      onChange={(e) => {
                        const newConditions = [...conditionsState];
                        if (e.target.checked) {
                          newConditions[rowIndex][conditionIndex].positionCondition = {
                            condition: 'row',
                            comparator: 'eq',
                            negative: false,
                            value: 0,
                          };
                        } else {
                          delete newConditions[rowIndex][conditionIndex]
                            .positionCondition;
                        }
                        setConditionsState(newConditions);
                      }}
                    />
                    is on position{' '}
                  </label>
                  {condition.positionCondition && (
                    <>
                      where
                      <select
                        className="pos-type-select"
                        value={condition.positionCondition.condition}
                        onChange={(e) => {
                          const newConditions = [...conditionsState];
                          const precursor =
                            newConditions[rowIndex][conditionIndex].positionCondition;
                          if (precursor) {
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
                        <input
                          type="checkbox"
                          className="pos-negative-select"
                          checked={condition.positionCondition.negative}
                          onChange={(e) => {
                            const newConditions = [...conditionsState];
                            const precursor =
                              newConditions[rowIndex][conditionIndex].positionCondition;
                            if (precursor) {
                              precursor.negative = e.target.checked;
                              setConditionsState(newConditions);
                            }
                          }}
                        />
                        not
                      </label>
                      <select
                        className="pos-comparator-select"
                        value={condition.positionCondition.comparator}
                        onChange={(e) => {
                          const newConditions = [...conditionsState];
                          const precursor =
                            newConditions[rowIndex][conditionIndex].positionCondition;
                          if (precursor) {
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
                        value={parseInt(String(condition.positionCondition.value)) + 1}
                        onChange={(e) => {
                          const newConditions = [...conditionsState];
                          const value = parseInt(e.target.value);
                          const precursor =
                            newConditions[rowIndex][conditionIndex].positionCondition;
                          if (precursor) {
                            precursor.value = value - 1;
                          }
                          setConditionsState(newConditions);
                        }}
                      />
                    </>
                  )}
                  <p> </p>
                  <label>
                    <input
                      type="checkbox"
                      className="position-condition-checkbox"
                      checked={!!condition.attackCondition}
                      onChange={(e) => {
                        const newConditions = [...conditionsState];
                        if (e.target.checked) {
                          newConditions[rowIndex][conditionIndex].attackCondition = {
                            condition: 'attacked',
                          };
                        } else {
                          delete newConditions[rowIndex][conditionIndex].attackCondition;
                        }
                        setConditionsState(newConditions);
                      }}
                    />
                    is under attack
                  </label>
                  {/* This kind of rules is not implemented yet -- currently 'is under attack' is the only option */}
                  {/* {condition.attackCondition && (
                    <>
                      that{' '}
                      <select
                        className="attack-type-select"
                        value={condition.attackCondition.condition}
                        onChange={(e) => {
                          const newConditions = [...conditionsState];
                          const attackCondition =
                            newConditions[rowIndex][conditionIndex].attackCondition;
                          if (attackCondition) {
                            attackCondition.condition = e.target
                              .value as AttackPrecursor['condition'];
                            setConditionsState(newConditions);
                          }
                        }}
                      >
                        <option value="attack">attacks</option>
                        <option value="attacked">is attacked by</option>
                      </select>
                      <select
                        className="condition-figure-role-select"
                        value={condition.attackCondition.role ?? 'any'}
                        onChange={(e) => {
                          const newConditions = [...conditionsState];
                          newConditions[rowIndex][conditionIndex].attackCondition!.role =
                            e.target.value === 'any'
                              ? undefined
                              : (e.target.value as Role);
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
                      figure
                    </>
                  )} */}
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
                  positionCondition: {
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
                positionCondition: {
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
          Create new rule
        </button>
      </div>
      <button className="gapped-button" type="submit" onClick={onFormSubmit}>
        Submit
      </button>
      <button className="gapped-button" type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
