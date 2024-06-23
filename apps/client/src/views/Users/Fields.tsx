import React, { Dispatch, SetStateAction } from 'react';
import { Label } from '@radix-ui/react-label';
import { RegisterUser } from '@/models';
import { Input } from '@/components/ui';

interface IFieldsProps {
  userData: RegisterUser;
  setUserData: Dispatch<SetStateAction<RegisterUser>>;
}

const Fields: React.FC<IFieldsProps> = ({ userData, setUserData }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            name="first_name"
            value={userData.first_name}
            // onChange={handleFormChange}
            placeholder="Max"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            name="last_name"
            value={userData.last_name}
            // onChange={handleFormChange}
            placeholder="Robinson"
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="last-name">Password</Label>
        <Input
          id="last-name"
          name="last_name"
          value={userData.password}
          // onChange={handleFormChange}
          placeholder="Robinson"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={userData.email}
          // onChange={handleFormChange}
          placeholder="m@example.com"
          required
        />
      </div>
    </>
  );
};

export default Fields;
