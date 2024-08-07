import React from 'react';
import { Input } from '@/components/ui';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ roleData, setRoleData }) => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        id="name"
        name="name"
        value={roleData.name}
        onChange={(e) =>
          setRoleData((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder="Role Name"
        required
      />
    </div>
  );
};

export default Fields;
