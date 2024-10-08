import { PlusCircle, TrashIcon } from 'lucide-react';
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
import { OperatorType } from '@trg_package/schemas-reporting/types';
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
    <div className="space-y-4">
      <h3 className="flex gap-2 items-center text-lg font-semibold mb-2">
        Conditions
        <Button size="sm" onClick={addCondition} variant="ghost">
          <PlusCircle className="w-4 h-4 mr-1" />
        </Button>
      </h3>
      {conditions.map((condition) => (
        <Conditon
          key={condition.id}
          removeCondition={() => removeCondition(condition.id)}
        />
      ))}
    </div>
  );
};

interface IConditionsProps {
  removeCondition: () => void;
}

const Conditon: React.FC<IConditionsProps> = ({ removeCondition }) => {
  const { columns, getOperators, getValue } = useReports();

  const [selectedColumn, setSelectedColumn] = useState<Column | undefined>(
    undefined
  );

  const [selectedOperation, setSelectedOperation] = useState<
    OperatorType['operator'] | undefined
  >(undefined);

  const [selectedValue, setSelectedValue] = useState<
    NonNullable<OperatorType['params']>[0] | undefined
  >(undefined);

  const [selectedJoin, setSelectedJoin] = useState<string | undefined>(
    undefined
  );

  const operations = useMemo(() => {
    if (!selectedColumn) return [];
    return getOperators(selectedColumn.data);
  }, [selectedColumn, getOperators]);

  const values = useMemo(() => {
    if (!selectedColumn || !selectedOperation) return [];
    return getValue(selectedColumn?.data, selectedOperation).params;
  }, [selectedColumn, selectedOperation, getValue]);

  return (
    <div className="mb-2 space-y-2">
      <div className="grid grid-cols-[2fr_2fr_2fr_2fr_auto] gap-2">
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

        <Select
          value={selectedOperation}
          onValueChange={setSelectedOperation}
          disabled={!operations?.length}
        >
          <SelectTrigger>
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Operators</SelectLabel>
              {operations.map((operator) => (
                <SelectItem value={operator.operator}>
                  {operator.operator}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={selectedValue}
          onValueChange={setSelectedValue}
          disabled={!values?.length}
        >
          <SelectTrigger>
            <SelectValue placeholder="Value" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Values</SelectLabel>
              {values?.map((value) => (
                <SelectItem value={value}>{value}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={selectedJoin}
          onValueChange={setSelectedJoin}
          disabled={!selectedColumn}
        >
          <SelectTrigger>
            <SelectValue placeholder="Join" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Join</SelectLabel>
              {['AND', 'OR', 'NOT']?.map((join) => (
                <SelectItem value={join}>{join}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          onClick={removeCondition}
          className="bg-red-500 text-white hover:text-black"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default Conditions;
