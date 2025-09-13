'use client';

import { FormEvent, useState } from 'react';
import './levelBuildEditObjectives.scss';

type EditObjectivesProps = {
  currentObjectives: string;
  onSave: (newObjectives: string) => any;
  onClose: (props?: any) => any;
};

export default function LevelBuildEditObjectives(props: EditObjectivesProps) {
  const [objectives, setObjectives] = useState(props.currentObjectives);

  const onConfirm = (e: FormEvent) => {
    e.preventDefault();
    props.onSave(objectives);
    props.onClose();
  };

  return (
    <form className="level-build-edit-objectives" onSubmit={onConfirm}>
      <h5>Level Objectives</h5>
      <label>
        Write down objectives
        <textarea value={objectives} onChange={(e) => setObjectives(e.target.value)} />
      </label>
      <div>
        <button
          className="gapped-button"
          type="button"
          onClick={() => setObjectives(props.currentObjectives)}
        >
          Reset
        </button>
        <button className="gapped-button" type="submit">
          Save
        </button>
        <button className="gapped-button" type="button" onClick={props.onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}
