import { PlusCircle, TrashIcon } from 'lucide-react';
import React from 'react';
import { Button } from '@trg_package/vite/components';
import { Filter, useReports } from '@/providers/ReportsProvider';
import Select from './Select';

const Filters: React.FC = () => {
  const { filters, addFilter, removeFilter } = useReports();

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
          key={filter.column.id}
          filter={filter}
          removeFilter={() => removeFilter(filter.column.id)}
        />
      ))}
    </div>
  );
};

const FilterComponent: React.FC<{
  filter: Filter;
  removeFilter: () => void;
}> = ({ filter, removeFilter }) => {
  const {
    fetchedColumns, updateFilter, filters
  } = useReports();

  const usedColumnIds = filters.map((c) => c.column.id);

  const availableColumns = fetchedColumns.filter(({
    column
  }) => !usedColumnIds.includes(column.id) || column.id === filter.column.id);

  return (
    <div className="mb-2 space-y-2">
      <div className="grid grid-cols-[2fr_2fr_auto] gap-4">
        <Select
          label="Column"
          value={filter.column.displayName}
          options={availableColumns.map(({ column }) => {
            if (!column.displayName) {
              return {
                label: 'No Name',
                value: 'No Name'
              };
            }
            return {
              label: column.displayName,
              value: column.displayName
            };
          })}
          onChange={(displayName) => {
            updateFilter(filter.column.id, {
              column: fetchedColumns
                .find((col) => col.column.displayName === displayName)?.column
            });
          }}
        />

        <Select
          label="Type"
          value={filter.filterType}
          options={['select', 'search', 'default'].map((type) => ({
            label: type,
            value: type
          }))}
          onChange={(filterType: string) => {
            updateFilter(filter.column.id, { filterType: filterType as 'select' | 'search' | 'default' });
          }}
          disabled={!filter.column}
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
