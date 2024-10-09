import { PlusCircle, TrashIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@trg_package/vite/components';
import { Filter, defaultFilter, useReports } from '@/providers/ReportsProvider';
import ConditionSelect from './ConditionSelect';

const Filters: React.FC = () => {
  const { filters, updateFilter, removeFilter } = useReports();

  return (
    <div className="space-y-4">
      <h3 className="flex gap-2 items-center text-lg font-semibold mb-2">
        <span>Filters</span>
        <Button size="sm" onClick={() => updateFilter()} variant="ghost">
          <PlusCircle className="w-4 h-4 mr-1" />
        </Button>
      </h3>
      {filters.map((filter) => (
        <FilterComponent
          key={filter.id}
          filter={filter}
          removeFilter={() => removeFilter(filter.id)}
        />
      ))}
    </div>
  );
};

const FilterComponent: React.FC<{
  removeFilter: () => void;
  filter: Filter;
}> = ({ removeFilter, filter }) => {
  const { columns, updateFilter } = useReports();

  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="mb-2 space-y-2">
      <div className="grid grid-cols-[2fr_2fr_auto] gap-2">
        <ConditionSelect
          label="Column"
          value={filter.column?.name || ''}
          options={columns.map(({ column }) => ({
            label: column.name,
            value: column.name
          }))}
          onChange={(columnName) =>
            updateFilter(filter.id, {
              ...defaultFilter,
              column: columns.find(({ column }) => column.name === columnName)
                ?.column
            })
          }
        />

        <ConditionSelect
          label="Type"
          value={filter.type || ''}
          options={['Select', 'Search'].map((type) => ({
            label: type,
            value: type
          }))}
          onChange={(typeName) =>
            updateFilter(filter.id, {
              type: typeName as 'Select' | 'Search'
            })
          }
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
