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
          key={filter.column?.displayName}
          filter={filter}
          removeFilter={() => removeFilter(filter.id)}
        />
      ))}
    </div>
  );
};

const FilterComponent: React.FC<{
  filter: Filter;
  removeFilter: () => void;
}> = ({ filter, removeFilter }) => {
  const { columns, availableColumns, updateFilter } = useReports();

  return (
    <div className="mb-2 space-y-2">
      <div className="grid grid-cols-[2fr_2fr_auto] gap-4">
        <Select
          label="Column"
          value={filter.column?.name}
          options={columns.concat(availableColumns).map(({ column }) => {
            if (!column?.displayName) {
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
            updateFilter(filter.id, {
              column: columns
                .concat(availableColumns)
                .find((col) => col.column?.displayName === displayName)?.column
            });
          }}
        />

        <Select
          label="Join"
          value={filter.filterType}
          options={['Select', 'Search'].map((join) => ({
            label: join,
            value: join
          }))}
          onChange={(filterType: string) => {
            updateFilter(filter.id, { filterType: filterType as 'select' | 'search' | 'range' });
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
