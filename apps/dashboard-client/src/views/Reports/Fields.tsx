import React from 'react';
import { Input } from '@trg_package/vite/components';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ reportData, setReportData }) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-4 items-center">
      <Input
        required
        minLength={3}
        placeholder="Name"
        value={reportData.name}
        onChange={(e) =>
          setReportData((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <Input
        required
        minLength={3}
        placeholder="Base Entity"
        value={reportData.baseEntity}
        onChange={(e) =>
          setReportData((prev) => ({ ...prev, baseEntity: e.target.value }))
        }
      />
    </div>
  </div>
);

export default Fields;
