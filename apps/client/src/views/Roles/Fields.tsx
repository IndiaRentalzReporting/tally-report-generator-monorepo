import React, { Dispatch, SetStateAction } from 'react';
import { Role } from '@/models';
import { Input, Label } from '@/components/ui';

interface IFieldsProps {
  roleData: Pick<Role, 'name'>;
  setRoleData: Dispatch<SetStateAction<Pick<Role, 'name'>>>;
}

const Fields: React.FC<IFieldsProps> = ({ roleData, setRoleData }) => {
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
