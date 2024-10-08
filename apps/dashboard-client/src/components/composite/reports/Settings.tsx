'use client';

import { useMemo, useState } from 'react';
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
import { useReports } from '@/providers/ReportsProvider';
import Conditions from './Conditions';

const ReportSettings = () => {
  const { columns } = useReports();
  const [filters, setFilters] = useState<Array<{ id: number }>>([]);

  const addFilter = () => {
    setFilters([...filters, { id: Date.now() }]);
  };

  const removeFilter = (id: number) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  const ColumnSelectItem = useMemo(
    () =>
      columns.map(({ column }) => (
        <SelectItem value={column.id || ''}>{column.id}</SelectItem>
      )),
    [columns]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Settings</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2 flex-1">Group By</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Column" />
            </SelectTrigger>
            <SelectContent>{ColumnSelectItem}</SelectContent>
          </Select>
          <Conditions />
          <div>
            <h3 className="text-lg font-semibold mb-2">Filters</h3>
            {filters.map((filter) => (
              <div key={filter.id} className="mb-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Column" />
                    </SelectTrigger>
                    <SelectContent>{ColumnSelectItem}</SelectContent>
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
