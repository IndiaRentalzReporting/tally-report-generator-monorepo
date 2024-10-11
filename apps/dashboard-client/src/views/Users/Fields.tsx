import React from 'react';
import { Input } from '@trg_package/vite/components';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ userData, setUserData }) => (
  <div className="flex flex-col gap-4">
    <div className="flex w-full gap-4">
      <div className="flex-grow">
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

export default Fields;
