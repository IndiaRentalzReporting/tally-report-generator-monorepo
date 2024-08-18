import React from 'react';
import { Input } from '@/components/ui';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ actionData, setActionData }) => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        id="name"
        name="name"
        value={actionData.name}
        onChange={(e) =>
          setActionData((prev) => ({
            ...prev,
            name: e.target.value
          }))
        }
        placeholder="Action Name"
        required
      />
    </div>
  );
};

export default Fields;
