import { PlusCircle, TrashIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Button, When, Input } from '@trg_package/vite/components';
import { Operators } from '@trg_package/schemas-reporting/types';
import { useReports } from '@/providers/ReportsProvider';
import ConditionSelect from './ConditionSelect';

const Conditions: React.FC = () => {
  const [conditions, setConditions] = useState<Array<{ id: number }>>([]);

  const addCondition = () => {
    setConditions((prev) => [...prev, { id: Date.now() }]);
  };

  const removeCondition = (id: number) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="flex gap-2 items-center text-lg font-semibold mb-2">
        Conditions
        <Button size="sm" onClick={() => addCondition()} variant="ghost">
          <PlusCircle className="w-4 h-4 mr-1" />
        </Button>
      </h3>
      {conditions.map((condition) => (
        <ConditionItem
          key={condition.id}
          onRemove={() => removeCondition(condition.id)}
        />
      ))}
    </div>
  );
};

const ConditionItem: React.FC<{
  onRemove: () => void;
}> = ({ onRemove }) => {
  const { columns, setCondition } = useReports();
  const [selectedColumnName, setSelectedColumnName] = useState<
    string | undefined
  >(undefined);

  const selectedColumn = useMemo(
    () => columns.find((col) => col.column.name === selectedColumnName),
    [selectedColumnName, columns]
  );

  const operations = useMemo(
    () => (selectedColumn ? (Operators[selectedColumn.column.type] ?? []) : []),
    [selectedColumn]
  );

  const values = useMemo(
    () =>
      selectedColumn && operations
        ? (Operators[selectedColumn.column.type].find(
            (op) => op.operator === selectedColumn.condition.operator
          )?.params ?? [])
        : [],
    [selectedColumn, operations]
  );

  return (
    <div className="flex items-center space-x-4 space-y-2">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 flex-grow">
        <ConditionSelect
          label="Column"
          value={selectedColumn?.column.name || ''}
          options={columns.map(({ column }) => ({
            label: column.name,
            value: column.name
          }))}
          onChange={(columnName) => {
            setSelectedColumnName(columnName);
          }}
        />

        <ConditionSelect
          label="Operator"
          value={selectedColumn?.condition.operator || ''}
          options={operations.map((op) => ({
            label: op.operator,
            value: op.operator
          }))}
          onChange={(operator) => {
            setCondition(selectedColumnName, {
              operator
            });
          }}
          disabled={!operations.length || !selectedColumn}
        />

        <When condition={!!values.length}>
          {values.map((value) => (
            <Input
              key={value}
              placeholder={value}
              type={selectedColumn?.column.type}
              onChange={({ target: { value } }) => {
                setCondition(selectedColumnName, {
                  value
                });
              }}
            />
          ))}
        </When>

        <ConditionSelect
          label="Join"
          value={selectedColumn?.condition.join || ''}
          options={['AND', 'OR', 'NOT'].map((join) => ({
            label: join,
            value: join
          }))}
          onChange={(join: string) => {
            setCondition(selectedColumnName, {
              join: join as 'AND' | 'OR' | 'NOT'
            });
          }}
          disabled={!selectedColumn}
          className="justify-self-end"
        />
      </div>

      <Button
        onClick={onRemove}
        className="bg-red-500 text-white hover:text-black flex-shrink-0"
      >
        <TrashIcon className="w-4 h-4 mr-1" />
      </Button>
    </div>
  );
};

export default Conditions;
