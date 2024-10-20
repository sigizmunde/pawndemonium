'use-client';

import { useEffect, useState } from 'react';
import { Board } from '@/model/board';
import { LevelConcept } from '@/types';
import LevelBuild from '../levelBuild';
import { getLevels, writeLevels } from '../server/levels';
import './builder.scss';
import { Loader } from '../loader';
import { convertBoardToStatic } from '@/helpers/convertBoardToStatic';

export default function Builder() {
  const [levelConcepts, setLevelConcepts] = useState<LevelConcept[]>([]);
  const [active, setActive] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const handleLoadLevels = async () => {
    setLoading(true);
    try {
      const l = await getLevels();
      setLevelConcepts(l);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSaveLevels = async () => {
    setSaving(true);
    try {
      await writeLevels('', levelConcepts);
      setSaving(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  useEffect(() => {
    handleLoadLevels();
  }, []);

  const handleCreateLevel = () => {
    const newLevelConcept: LevelConcept = {
      id: crypto.randomUUID(),
      staticBoards: [
        // change to StaticBoard type, not class
        convertBoardToStatic(
          new Board({
            id: crypto.randomUUID(),
            space: Array(8).fill(Array(8).fill(true)),
          })
        ),
      ],
      staticFigures: [],
      accomplishedChecks: [],
      failedChecks: [],
      allowSinglePlayer: true,
    };
    setLevelConcepts((concepts) => [newLevelConcept, ...concepts]);
  };

  const handleSaveConcept = (editedConcept: LevelConcept) => {
    setLevelConcepts((concepts) => {
      const current = concepts.findIndex((lc) => lc.id === editedConcept.id);
      if (current > -1) {
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="builder-buttons-block">
            <button type="button" onClick={handleLoadLevels}>
              Load levels
            </button>
            <button type="button" onClick={handleSaveLevels}>
              Save levels
            </button>
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
          {saving && <Loader />}
        </>
      )}
    </main>
  );
}
