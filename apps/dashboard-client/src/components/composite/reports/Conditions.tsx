import { PlusCircle, TrashIcon } from 'lucide-react';
import React from 'react';
import { Button, When, Input } from '@trg_package/vite/components';
import { StaticConditionOperators, ConditionOperations } from '@trg_package/schemas-reporting/types';
import { Condition, useReports } from '@/providers/ReportsProvider';
import Select from './Select';

const Conditions: React.FC = () => {
  const { conditions, addCondition, removeCondition } = useReports();

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
          key={condition.column?.name}
          condition={condition}
          onRemove={() => removeCondition(condition.column?.name || '')}
        />
      ))}
    </div>
  );
};

const ConditionItem: React.FC<{
  condition: Condition;
  onRemove: () => void;
}> = ({ condition, onRemove }) => {
  const { columns, availableColumns, updateCondition } = useReports();

  const operations = condition.column
    ? (StaticConditionOperators[condition.column.type] ?? [])
    : [];

  const values = condition.operator ? ConditionOperations[condition.operator] : {};

  return (
    <div className="flex items-center space-x-4 space-y-2">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 flex-grow">
        <Select
          label="Column"
          value={condition.column?.name}
          options={columns.concat(availableColumns).map(({ column }) => ({
            label: column?.name || '',
            value: column?.name || ''
          }))}
          onChange={(id) => {
            updateCondition(condition.column?.name, {
              column: columns
                .concat(availableColumns)
                .find((col) => col.column?.name === id)?.column
            });
          }}
        />

        <Select
          label="Operator"
          value={condition.operator}
          options={operations.map((op) => ({
            label: op,
            value: op
          }))}
          onChange={(operatorName) => {
            if (!condition.column?.type) return;
            const operator = StaticConditionOperators[condition.column?.type].find(
              (op) => op === operatorName
            );
            updateCondition(condition.column?.name, { operator });
          }}
          disabled={!operations.length || !condition.column}
        />

        <When condition={!!values}>
          {Object.keys(values!)?.map((value) => (
            <Input
              key={value}
              placeholder={value}
              type={condition.column?.type}
              onChange={({ target: { value: v } }) => {
                updateCondition(condition.column?.name, { [value]: v });
              }}
            />
          ))}
        </When>

        <Select
          label="Join"
          value={condition.join || ''}
          options={['AND', 'OR', 'AND NOT', 'OR NOT'].map((join) => ({
            label: join,
            value: join
          }))}
          onChange={(join: string) => {
            updateCondition(condition.column?.name, {
              join: join as 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
            });
          }}
          disabled={!condition.column}
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
