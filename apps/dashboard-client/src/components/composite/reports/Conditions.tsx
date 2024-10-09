import { PlusCircle, TrashIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { Button, When, Input } from '@trg_package/vite/components';
import { Operators } from '@trg_package/schemas-reporting/types';
import {
  Condition,
  initialCondition,
  useReports
} from '@/providers/ReportsProvider';
import ConditionSelect from './ConditionSelect';

const Conditions: React.FC = () => {
  const { conditions, updateCondition, removeCondition } = useReports();

  return (
    <div className="space-y-4">
      <h3 className="flex gap-2 items-center text-lg font-semibold mb-2">
        Conditions
        <Button size="sm" onClick={() => updateCondition()} variant="ghost">
          <PlusCircle className="w-4 h-4 mr-1" />
        </Button>
      </h3>
      {conditions.map((condition) => (
        <ConditionItem
          key={condition.id}
          condition={condition}
          onRemove={() => removeCondition(condition.id)}
        />
      ))}
    </div>
  );
};

const ConditionItem: React.FC<{
  condition: Condition;
  onRemove: () => void;
}> = ({ condition, onRemove }) => {
  const { columns, updateCondition } = useReports();

  const operations = useMemo(
    () => (condition.column ? (Operators[condition.column.type] ?? []) : []),
    [condition]
  );

  const values = useMemo(
    () =>
      condition.column && condition.operator
        ? (Operators[condition.column.type].find(
            (op) => op.operator == condition.operator
          )?.params ?? [])
        : [],
    [condition]
  );

  return (
    <div className="flex items-center space-x-4 space-y-2">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 flex-grow">
        <ConditionSelect
          label="Column"
          value={condition.column?.name || ''}
          options={columns.map(({ data }) => ({
            label: data.name,
            value: data.name
          }))}
          onChange={(columnName) =>
            updateCondition(condition.id, {
              ...initialCondition,
              column: columns.find(({ data }) => data.name === columnName)?.data
            })
          }
        />

        <ConditionSelect
          label="Operator"
          value={condition.operator || ''}
          options={operations.map((op) => ({
            label: op.operator,
            value: op.operator
          }))}
          onChange={(operatorName) =>
            updateCondition(condition.id, {
              ...initialCondition,
              column: condition.column,
              operator: operatorName
            })
          }
          disabled={!operations.length}
        />

        <When condition={!!values.length}>
          {values.map((value) => (
            <Input
              key={value}
              placeholder={value}
              type={condition.column?.type}
              onChange={({ target }) => {
                updateCondition(condition.id, { value: target.value });
              }}
            />
          ))}
        </When>
        <ConditionSelect
          label="Join"
          value={condition.join || ''}
          options={['AND', 'OR', 'NOT'].map((join) => ({
            label: join,
            value: join
          }))}
          onChange={(joinName) =>
            updateCondition(condition.id, {
              join: joinName as 'AND' | 'OR' | 'NOT'
            })
          }
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
