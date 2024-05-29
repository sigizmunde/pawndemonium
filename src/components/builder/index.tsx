'use-client';

import { useState } from 'react';
import { Board } from '@/model/board';
import { LevelConcept } from '@/types';
import LevelBuild from '../levelBuild';
import './builder.scss';

export default function Builder() {
  const [levelConcepts, setLevelConcepts] = useState<LevelConcept[]>([]);
  const [active, setActive] = useState<string>();

  const handleCreateLevel = () => {
    const newLevelConcept: LevelConcept = {
      id: crypto.randomUUID(),
      boards: [
        new Board({ id: crypto.randomUUID(), space: Array(8).fill(Array(8).fill(true)) }),
      ],
      staticFigures: [],
      accomplishedChecks: [],
      failedChecks: [],
      allowSinglePlayer: true,
    };
    setLevelConcepts((concepts) => [...concepts, newLevelConcept]);
  };

  const handleSaveConcept = (editedConcept: LevelConcept) => {
    setLevelConcepts((concepts) => {
      const current = concepts.findIndex((lc) => lc.id !== editedConcept.id);
      if (current) {
        concepts[current] = editedConcept;
        return [...concepts];
      }
      return [...concepts, editedConcept];
    });
  };

  const handleRemoveLevel = (id: string) => {
    setLevelConcepts((concepts) => concepts.filter((lc) => lc.id !== id));
  };

  return (
    <main className="main">
      <div className="builder-buttons-block">
        <button type="button" onClick={handleCreateLevel}>
          Create level
        </button>
      </div>
      {levelConcepts.map((lc) => (
        <LevelBuild
          key={lc.id}
          levelConcept={lc}
          onSave={handleSaveConcept}
          onDelete={handleRemoveLevel}
          active={active === lc.id}
          onSetActive={setActive}
        />
      ))}
    </main>
  );
}
