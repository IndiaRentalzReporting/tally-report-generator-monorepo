import React from 'react';
import { Select, Button } from '@trg_package/vite/components';

const Settings: React.FC = () => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold mb-4">Report Settings</h2>
    <div className="flex items-center mb-4">
      <label className="w-24">Group By</label>
      <Select>
        <option>Select</option>
      </Select>
    </div>
    <div className="mb-4">
      <h3 className="text-xl mb-2">Conditions</h3>
      <Button variant="outline" className="w-full">
        Add Condition
      </Button>
    </div>
    <div>
      <h3 className="text-xl mb-2">Filters</h3>
      <Button variant="outline" className="w-full">
        Add Filter
      </Button>
    </div>
  </div>
);

export default Settings;
