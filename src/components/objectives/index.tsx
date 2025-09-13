import { useEffect, useState } from 'react';
import './objectives.scss';

export function Objectives({
  info = '',
  showByDefault = true,
}: {
  info?: string;
  showByDefault?: boolean;
}) {
  const [mobileObjShow, setMobileObjShow] = useState(false);

  useEffect(() => {
    setMobileObjShow(showByDefault);
  }, [info, showByDefault]);

  const contents = info.split('\n').map((p, i) => <p key={i}>{p}</p>);

  return info ? (
    <>
      <div className="objectives">
        <div className="objectives-contents">{contents}</div>
      </div>
      <div className={`objectives-mobile ${mobileObjShow ? 'open' : 'closed'}`}>
        <button onClick={() => setMobileObjShow((state) => !state)}>
          {mobileObjShow ? 'X' : '<'}
        </button>
        <div className="objectives-contents">{contents}</div>
      </div>
    </>
  ) : null;
}
