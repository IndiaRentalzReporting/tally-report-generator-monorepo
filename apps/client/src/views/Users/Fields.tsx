import React from 'react';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ userData, setUserData }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full gap-4">
        <div className="flex-grow">
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            name="first_name"
            value={userData.first_name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, first_name: e.target.value }))
            }
            placeholder="Max"
            required
          />
        </div>
        <div className="flex-grow">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            name="last_name"
            value={userData.last_name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, last_name: e.target.value }))
            }
            placeholder="Robinson"
            required
          />
        </div>
      </div>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        name="email"
        value={userData.email}
        onChange={(e) =>
          setUserData((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="m@example.com"
        required
      />
      <Label htmlFor="last-name">Password</Label>
      <Input
        type="password"
        id="password"
        name="password"
        value={userData.password}
        onChange={(e) =>
          setUserData((prev) => ({ ...prev, password: e.target.value }))
        }
        placeholder="********"
        required
      />
    </div>
  );
};

export default Fields;
