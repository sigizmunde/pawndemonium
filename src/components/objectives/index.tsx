import { useState } from 'react';
import './objectives.scss';

export function Objectives({ info = '' }: { info?: string }) {
  const [mobileObjShow, setMobileObjShow] = useState(false);

  const contents = info.split('\n').map((p, i) => <p key={i}>{p}</p>);

  return info ? (
    <>
      <div className="objectives">{contents}</div>
      <div className={`objectives-mobile ${mobileObjShow ? 'open' : 'closed'}`}>
        <button onClick={() => setMobileObjShow((state) => !state)}>
          {mobileObjShow ? 'X' : '<'}
        </button>
        {contents}
      </div>
    </>
  ) : null;
}
