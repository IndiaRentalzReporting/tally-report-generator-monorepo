'use client';

import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader
} from '@trg_package/vite/components';

const ReportSettings = () => {
  const [conditions, setConditions] = useState<Array<{ id: number }>>([]);
  const [filters, setFilters] = useState<Array<{ id: number }>>([]);

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now() }]);
  };

  const removeCondition = (id: number) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  const addFilter = () => {
    setFilters([...filters, { id: Date.now() }]);
  };

  const removeFilter = (id: number) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Settings</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2 flex-1 w-min">Group By</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option">Option</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <h3 className="text-lg font-semibold mb-2">Conditions</h3>
            {conditions.map((condition) => (
              <div key={condition.id} className="mb-2 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="column">Column</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operator">Operator</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value">Value</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Join" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="join">Join</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCondition(condition.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            ))}
            <Button size="sm" onClick={addCondition} className="mt-2">
              <PlusCircle className="w-4 h-4 mr-1" /> Add Condition
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Filters</h3>
            {filters.map((filter) => (
              <div key={filter.id} className="mb-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="column">Column</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter(filter.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="w-4 h-4 mr-1" /> Remove
                </Button>
              </div>
            ))}
            <Button size="sm" onClick={addFilter} className="mt-2">
              <PlusCircle className="w-4 h-4 mr-1" /> Add Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSettings;
