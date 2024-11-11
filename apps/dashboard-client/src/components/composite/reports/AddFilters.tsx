import { PlusCircle, TrashIcon } from 'lucide-react';
import React from 'react';
import {
  Button, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Select
} from '@trg_package/vite/components';
import { FilterOperations } from '@trg_package/schemas-reporting/types';
import { Filter, useReports } from '@/providers/ReportsProvider';

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
      <div className='flex flex-col gap-6'>
        {filters.map((filter) => (
          <FilterComponent
          key={filter.column.id}
          filter={filter}
          removeFilter={() => removeFilter(filter.column.id)}
          />
        ))}
      </div>
    </div>
  );
};

const FilterComponent: React.FC<{
  filter: Filter;
  removeFilter: () => void;
}> = ({ filter, removeFilter }) => {
  const {
    fetchedColumns, updateFilter: UF, filters
  } = useReports();

  const usedColumnIds = filters.map((c) => c.column.id);

  const availableColumns = fetchedColumns.filter(({
    column
  }) => !usedColumnIds.includes(column.id) || column.id === filter.column.id);

  const updateFilter = (data: Partial<Filter>) => {
    UF(filter.column.id, data);
  };

  const operations = Object.keys(FilterOperations).filter((operatorName) => {
    const operation = FilterOperations[operatorName as keyof typeof FilterOperations];
    const operationFor = operation.for;
    return filter.column ? operationFor.includes(filter.column.type) : [];
  });

  return (
    <div className="grid grid-cols-[2fr_2fr_auto] gap-6">
      <Select
        value={filter.column.displayName}
        onValueChange={(displayName) => {
          updateFilter({
            column: fetchedColumns
              .find((col) => col.column.displayName === displayName)?.column,
            filterType: undefined
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Column" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Column</SelectLabel>
            {availableColumns.map(({ column }) => (
              <SelectItem key={column.displayName} value={column.displayName}>
                {column.displayName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={filter.filterType}
        onValueChange={(filterType: string) => {
          updateFilter({ filterType: filterType as 'select' | 'search' | 'between' });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filter Type</SelectLabel>
            {operations.map((operation) => (
              <SelectItem key={operation} value={operation}>
                {operation}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        onClick={removeFilter}
        className="bg-red-500 text-white hover:text-black"
      >
        <TrashIcon className="w-4 h-4 mr-1" />
      </Button>
    </div>
  );
};

export default Filters;
