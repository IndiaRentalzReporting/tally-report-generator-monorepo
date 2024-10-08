import { X, PlusCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  SelectGroup,
  SelectLabel
} from '@trg_package/vite/components';
import { Operators } from '@trg_package/schemas-reporting/types';
import { Column, useReports } from '@/providers/ReportsProvider';

const Conditions: React.FC = () => {
  const [conditions, setConditions] = useState<Array<{ id: number }>>([]);

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now() }]);
  };

  const removeCondition = (id: number) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Conditions</h3>
      {conditions.map((condition) => (
        <Conditon column={condition} removeCondition={removeCondition} />
      ))}
      <Button size="sm" onClick={addCondition} className="mt-2">
        <PlusCircle className="w-4 h-4 mr-1" /> Add Condition
      </Button>
    </div>
  );
};

interface IConditionsProps {
  column: { id: number };
  removeCondition: (id: number) => void;
}

const Conditon: React.FC<IConditionsProps> = ({ column, removeCondition }) => {
  const { columns } = useReports();

  const [selectedColumn, setSelectedColumn] = useState<Column | undefined>(
    undefined
  );

  const [selectedOperation, setSelectedOperation] = useState<
    string | undefined
  >(undefined);

  const ColumnSelectItem = useMemo(
    () =>
      columns.map((entity) => (
        <SelectItem value={JSON.stringify(entity)}>
          {entity.data.name}
        </SelectItem>
      )),
    [columns]
  );

  const OperatorSelectItem = useMemo(
    () =>
      selectedColumn
        ? Operators[selectedColumn.data.type].map((operator) => (
            <SelectItem value={operator.operator}>
              {operator.operator}
            </SelectItem>
          ))
        : null,
    [selectedColumn]
  );

  console.log(selectedColumn);

  return (
    <div key={column.id} className="mb-2 space-y-2">
      <div className="grid grid-cols-4 gap-2">
        <Select
          value={selectedColumn?.data.name}
          onValueChange={(column) => setSelectedColumn(JSON.parse(column))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Column" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Columns</SelectLabel>
              {ColumnSelectItem}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={selectedOperation}
          onValueChange={(selectedOperation) =>
            setSelectedOperation(selectedOperation)
          }
          disabled={!selectedColumn}
        >
          <SelectTrigger>
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Operators</SelectLabel>
              {OperatorSelectItem}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select disabled={!selectedColumn}>
          <SelectTrigger>
            <SelectValue placeholder="Value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value">Value</SelectItem>
          </SelectContent>
        </Select>
        <Select disabled={!selectedColumn}>
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
        onClick={() => removeCondition(column.id)}
        className="text-red-500 hover:text-red-400"
      >
        <X className="w-4 h-4 mr-1" /> Remove
      </Button>
    </div>
  );
};

export default Conditions;
