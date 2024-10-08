import { PlusCircle, TrashIcon } from 'lucide-react';
import React, { useState } from 'react';
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from '@trg_package/vite/components';
import { Column, useReports } from '@/providers/ReportsProvider';

const Filters: React.FC = () => {
  const [filters, setFilters] = useState<Array<{ id: number }>>([]);

  const addFilter = () => {
    setFilters([...filters, { id: Date.now() }]);
  };

  const removeFilter = (id: number) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="flex gap-2 items-center text-lg font-semibold mb-2">
        <span>Filters</span>
        <Button size="sm" onClick={addFilter} variant="ghost">
          <PlusCircle className="w-4 h-4 mr-1" />
        </Button>
      </h3>
      {filters.map((filter) => (
        <Filter key={filter.id} removeFilter={() => removeFilter(filter.id)} />
      ))}
    </div>
  );
};

interface IFiltersProps {
  removeFilter: () => void;
}

const Filter: React.FC<IFiltersProps> = ({ removeFilter }) => {
  const { columns } = useReports();

  const [selectedColumn, setSelectedColumn] = useState<Column | undefined>(
    undefined
  );

  const [selectedType, setSelectedType] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="mb-2 space-y-2">
      <div className="grid grid-cols-[2fr_2fr_auto] gap-2">
        <Select
          value={selectedColumn?.data.name}
          onValueChange={(columnName) =>
            setSelectedColumn(
              columns.find((col) => col.data.name === columnName)
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Columns</SelectLabel>
              {columns.map(({ data }) => (
                <SelectItem value={data.name}>{data.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              {['Select', 'Search'].map((type) => (
                <SelectItem value={type}>{type}</SelectItem>
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
    </div>
  );
};

export default Filters;
