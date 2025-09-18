'use-client';

import { useContext, useEffect, useState } from 'react';
import { Board } from '@/model/board';
import { Level, LevelConcept, StaticBoard, StaticFigure } from '@/types';
import LevelBuild from '../levelBuild';
import { getLevels, writeLevels } from '../../app/server/levels';
import { UserContext } from '../userContext';
import { Loader } from '../loader';
import { convertBoardToStatic } from '@/helpers/convertBoardToStatic';
import { createLevel } from '@/helpers/levelBuilder';
import BuilderDemoGame from '../builderDemoGame';
import './builder.scss';

export default function Builder() {
  const { user } = useContext(UserContext);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [levelConcepts, setLevelConcepts] = useState<LevelConcept[]>([]);
  const [active, setActive] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [levels, setLevels] = useState<Level[]>([]);

  const handleLoadLevels = async () => {
    setLoading(true);
    try {
      const l = await getLevels(user?.email);
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
      await writeLevels({ userEmail: user?.email, levels: levelConcepts });
      setSaving(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  const handleSetLevelBoards = (id: string, boards: StaticBoard[]) => {
    setLevelConcepts((prev) =>
      prev.map((lvl) => (lvl.id === id ? { ...lvl, staticBoards: boards } : lvl))
    );
  };

  const handleSetLevelFigures = (id: string, figures: StaticFigure[]) => {
    setLevelConcepts((prev) =>
      prev.map((lvl) => (lvl.id === id ? { ...lvl, staticFigures: figures } : lvl))
    );
  };

  const handleSetLevelObjectives = (id: string, objectives: string) => {
    setLevelConcepts((prev) =>
      prev.map((lvl) => (lvl.id === id ? { ...lvl, objectives } : lvl))
    );
  };

  useEffect(() => {
    handleLoadLevels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setLevelConcepts((concepts) => [...concepts, newLevelConcept]);
  };

  const handleRemoveLevel = (id: string) => {
    setLevelConcepts((concepts) => concepts.filter((lc) => lc.id !== id));
  };

  useEffect(() => {
    setLevels(levelConcepts.map((cl) => createLevel(cl, { pawnToQueen: true })));
  }, [levelConcepts, demoMode]);

  console.log('levels', levels);

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
            <button type="button" onClick={() => setDemoMode(!demoMode)}>
              {demoMode ? 'Stop Demo' : 'Start Demo'}
            </button>
          </div>
          {demoMode ? (
            <BuilderDemoGame levels={levels} />
          ) : (
            levelConcepts
              .map((lc) => (
                <LevelBuild
                  key={lc.id}
                  staticBoards={lc.staticBoards}
                  onSetStaticBoards={(boards) => handleSetLevelBoards(lc.id, boards)}
                  staticFigures={lc.staticFigures}
                  onSetStaticFigures={(figures) => handleSetLevelFigures(lc.id, figures)}
                  onDeleteLevel={() => handleRemoveLevel(lc.id)}
                  active={active === lc.id}
                  onSetActive={() => setActive(lc.id)}
                  levelObjectives={lc.objectives || ''}
                  onSetLevelObjectives={(objectives) =>
                    handleSetLevelObjectives(lc.id, objectives)
                  }
                />
              ))
              .reverse()
          )}
          {saving && <Loader />}
        </>
      )}
    </main>
  );
}
