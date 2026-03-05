import { ConditionFrame } from '@/types';
import { useState } from 'react';
import LevelBuildConditionsForm from '../levelBuildConditionsForm';
import './levelBuildConditions.scss';

type ConditionsProps = {
  accomplishedChecks: ConditionFrame[][];
  failedChecks: ConditionFrame[][];
  extraChecks?: ConditionFrame[][];
  onSetAccomplishedChecks: (checks: ConditionFrame[][]) => any;
  onSetFailedChecks: (checks: ConditionFrame[][]) => any;
  onSetExtraChecks?: (checks: ConditionFrame[][]) => any;
  onClose: () => any;
};

export default function LevelBuildConditions({
  accomplishedChecks,
  failedChecks,
  extraChecks = undefined,
  onSetAccomplishedChecks,
  onSetFailedChecks,
  onSetExtraChecks = undefined,
  onClose,
}: ConditionsProps) {
  const [tab, setTab] = useState<'accomplished' | 'failed' | 'extra'>('accomplished');

  const handleSubmit = (checks: ConditionFrame[][]) => {
    if (tab === 'accomplished') {
      onSetAccomplishedChecks(checks);
    } else if (tab === 'failed') {
      onSetFailedChecks(checks);
    } else if (tab === 'extra' && onSetExtraChecks) {
      onSetExtraChecks(checks);
    }
    onClose();
  };

  return (
    <div className="level-build-conditions-wrapper">
      <h3>
        <span
          className={tab === 'accomplished' ? 'selected' : ''}
          onClick={() => setTab('accomplished')}
        >
          Win conditions
        </span>
        <span
          className={tab === 'failed' ? 'selected' : ''}
          onClick={() => setTab('failed')}
        >
          Loose conditions
        </span>
        {extraChecks && (
          <span
            className={tab === 'extra' ? 'selected' : ''}
            onClick={() => setTab('extra')}
          >
            Extra conditions
          </span>
        )}
      </h3>
      <LevelBuildConditionsForm
        conditions={
          tab === 'accomplished'
            ? accomplishedChecks
            : tab === 'failed'
              ? failedChecks
              : extraChecks || [[]]
        }
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </div>
  );
}
