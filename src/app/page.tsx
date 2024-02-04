'use client';

import Game from '@/components/game';
import './page.scss';
import { Controller } from '@/controller';

const controller = new Controller();

export default function Home() {
  return <Game controller={controller} />;
}
