'use-client';

import { useState } from "react";
import './builder.scss'

export default function Builder() {
    const [levels, setLevels] = useState<any[]>([]);
    const [current, setCurrent] = useState<number>(0);
    

  return (
    <main className="main">
      <div />
    </main>
  );
}
