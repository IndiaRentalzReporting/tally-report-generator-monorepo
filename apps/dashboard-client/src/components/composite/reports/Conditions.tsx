import { PlusCircle, TrashIcon } from 'lucide-react';
import React from 'react';
import { Button, When, Input } from '@trg_package/vite/components';
import { ConditionOperations, ReportSelect } from '@trg_package/schemas-reporting/types';
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
          key={condition.column.id}
          condition={condition}
          onRemove={() => removeCondition(condition.column.id)}
        />
      ))}
    </div>
  );
};

const ConditionItem: React.FC<{
  condition: Condition;
  onRemove: () => void;
}> = ({ condition, onRemove }) => {
  const {
    updateCondition: UC, fetchedColumns, conditions
  } = useReports();

  const usedColumnIds = conditions.map((c) => c.column.id);

  const availableColumns = fetchedColumns.filter(({
    column
  }) => !usedColumnIds.includes(column.id) || column.id === condition.column.id);

  const operations = Object.keys(ConditionOperations).filter((operatorName) => {
    const operation = ConditionOperations[operatorName as keyof typeof ConditionOperations];
    const operationFor = operation.for;
    return condition.column ? operationFor.includes(condition.column.type) : [];
  });

  const values = condition.operator
    ? ConditionOperations[condition.operator].params
    : null;

  const updateCondition = (data: Partial<Condition>) => {
    UC(condition.column.id, condition, data);
  };

  return (
    <div className="flex items-center space-x-4 space-y-2">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 flex-grow">
        <Select
          label="Column"
          value={condition.column.displayName}
          options={availableColumns
            .map(({ column }) => ({
              label: column.displayName,
              value: column.displayName
            }))}
          onChange={(id) => {
            updateCondition({
              column: fetchedColumns
                .find((col) => col.column.displayName === id)?.column,
              join: undefined,
              operator: undefined,
              params: undefined
            });
          }}
        />

        <When condition={!!condition.column.id}>
          <Select
            label="Operator"
            value={condition.operator}
            options={operations.map((op) => ({
              label: op,
              value: op
            }))}
            onChange={(operator) => updateCondition({
              operator: operator as ReportSelect['conditions'][number]['operator'],
              params: undefined,
              join: undefined
            },)}
          />

          <When condition={!!values && !!Object.keys(values).length}>
            {values && Object.keys(values).map((param) => (
              <Input
                value={condition.params ? condition.params[param as keyof typeof values] as string : ''}
                key={param}
                placeholder={param}
                type={condition.column.type}
                onChange={({ target: { value } }) => updateCondition({
                  params: { ...condition.params, [param]: value } as ReportSelect['conditions'][number]['params']
                })}
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
            onChange={(join: string) => updateCondition({
              join: join as ReportSelect['conditions'][number]['join']
            })
            }
            className="justify-self-end"
          />
        </When>
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
