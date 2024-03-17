import { ReactNode } from 'react';
import './fieldWrapper.scss';

export function FieldWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="field-wrapper">
      <div className="row-numbers left">
        {new Array(8).fill(true).map((_, index) => (
          <div key={index} className="row-num">
            {8 - index}
          </div>
        ))}
      </div>
      <div className="field-inner-wrapper">{children}</div>
      <div className="row-numbers right">
        {new Array(8).fill(true).map((_, index) => (
          <div key={index} className="row-num">
            {8 - index}
          </div>
        ))}
      </div>
    </div>
  );
}
