import { PlusCircle, TrashIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Button } from '@trg_package/vite/components';
import { useReports } from '@/providers/ReportsProvider';
import Select from './Select';

const Filters: React.FC = () => {
  const [filters, setFilters] = useState<Array<{ id: number }>>([]);

  const addFilter = () => {
    setFilters((prev) => [...prev, { id: Date.now() }]);
  };

  const removeFilter = (id: number) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="flex gap-2 items-center text-lg font-semibold mb-2">
        <span>Filters</span>
        <Button size="sm" onClick={() => addFilter()} variant="ghost">
          <PlusCircle className="w-4 h-4 mr-1" />
        </Button>
      </h3>
      {filters.map((filter) => (
        <FilterComponent
          key={filter.id}
          removeFilter={() => removeFilter(filter.id)}
        />
      ))}
    </div>
  );
};

const FilterComponent: React.FC<{
  removeFilter: () => void;
}> = ({ removeFilter }) => {
  const { columns, updateColumn } = useReports();

  const [selectedColumnName, setSelectedColumnName] = useState<
    string | undefined
  >(undefined);

  const selectedColumn = useMemo(
    () => columns.find((col) => col.column.name === selectedColumnName),
    [selectedColumnName, columns]
  );

  return (
    <div className="mb-2 space-y-2">
      <div className="grid grid-cols-[2fr_2fr_auto] gap-2">
        <Select
          label="Column"
          value={selectedColumn?.column.name}
          options={columns.map(({ column }) => ({
            label: column.name,
            value: column.name
          }))}
          onChange={setSelectedColumnName}
        />

        <Select
          label="Join"
          value={selectedColumn?.filter.type}
          options={['AND', 'OR', 'NOT'].map((join) => ({
            label: join,
            value: join
          }))}
          onChange={(type: string) => {
            updateColumn(selectedColumnName, 'filter', {
              type: type as 'Select' | 'Search'
            });
          }}
          disabled={!selectedColumn}
          className="justify-self-end"
        />

        <Button
          onClick={removeFilter}
          className="bg-red-500 text-white hover:text-black"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default Filters;
