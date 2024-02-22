'use client';

import Game from '@/components/game';
import { Controller } from '@/controller';
import './page.scss';

const controller = new Controller();

export default function Home() {
  return <Game controller={controller} />;
}
