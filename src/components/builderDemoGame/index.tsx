'use client';

import Game from '@/components/game';
import { Controller } from '@/controller';
import { Level } from '@/types';
import './builderDemoGame.scss';

const controller = new Controller();

export default function BuilderDemoGame({ levels }: { levels: Level[] }) {
  return <Game controller={controller} levels={levels} />;
}
