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

  const [accomplishedChecksState, setAccomplishedChecksState] =
    useState<ConditionFrame[][]>(accomplishedChecks);
  const [failedChecksState, setFailedChecksState] =
    useState<ConditionFrame[][]>(failedChecks);
  const [extraChecksState, setExtraChecksState] = useState<
    ConditionFrame[][] | undefined
  >(extraChecks || undefined);

  const handleSubmit = (checks: ConditionFrame[][]) => {
    onSetAccomplishedChecks(accomplishedChecksState);
    onSetFailedChecks(failedChecksState);
    if (extraChecksState && onSetExtraChecks) {
      onSetExtraChecks(extraChecksState);
    }
    onClose();
  };

  const handleUpdateState = (checks: ConditionFrame[][]) => {
    if (tab === 'accomplished') {
      setAccomplishedChecksState(checks);
    } else if (tab === 'failed') {
      setFailedChecksState(checks);
    } else if (tab === 'extra' && onSetExtraChecks) {
      setExtraChecksState(checks);
    }
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
        conditionsState={
          tab === 'accomplished'
            ? accomplishedChecksState
            : tab === 'failed'
              ? failedChecksState
              : extraChecksState || [[]]
        }
        setConditionsState={handleUpdateState}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </div>
  );
}
