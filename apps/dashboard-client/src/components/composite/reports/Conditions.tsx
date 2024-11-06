/* eslint-disable no-nested-ternary */
import {
  CalendarIcon, PlusCircle, TrashIcon
} from 'lucide-react';
import React from 'react';
import {
  Button, When, Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  MultiSelect,
  Skeleton,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Select
} from '@trg_package/vite/components';
import { ConditionOperations, ReportSelect } from '@trg_package/schemas-reporting/types';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { Condition, useReports } from '@/providers/ReportsProvider';
import { getColumnData } from '@/services/Columns';

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
          value={condition.column.displayName}
          onValueChange={(id) => {
            updateCondition({
              column: fetchedColumns
                .find((col) => col.column.displayName === id)?.column,
              join: undefined,
              operator: undefined,
              params: undefined
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Columns" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Columns</SelectLabel>
              {availableColumns.map(({ column }) => (
                <SelectItem key={column.displayName} value={column.displayName}>
                  {column.displayName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <When condition={!!condition.column.id}>
          <Select
            value={condition.operator}
            onValueChange={(operator) => updateCondition({
              operator: operator as ReportSelect['conditions'][number]['operator'],
              params: undefined,
              join: undefined
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Operator</SelectLabel>
                {operations.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <When condition={!!values && !!Object.keys(values).length}>
            {values && Object.keys(values).map((param) => (
              condition.operator === 'IN'
                ? <ConditionParamsSelect
                    values={values}
                    param={param as keyof typeof values}
                    condition={condition}
                    updateCondition={updateCondition}
                  />
                : condition.column.type === 'date'
                  ? <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`justify-start text-left font-normal ${!condition.params && 'text-muted-foreground'} overflow-x-auto`}
                        >
                          <CalendarIcon className="mr-2 h-4 min-w-4" />
                          {
                            condition.params
                              ? moment(condition.params[param as keyof typeof values]).format('ll')
                              : <span>Pick a date</span>
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={condition.params
                            ? condition.params[param as keyof typeof values]
                            : undefined
                          }
                          onSelect={(newValues) => updateCondition({
                            params: { ...condition.params, [param]: newValues } as ReportSelect['conditions'][number]['params']
                          })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  : <Input
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
            value={condition.join}
            onValueChange={(join: string) => updateCondition({
              join: join as ReportSelect['conditions'][number]['join']
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Join" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Join</SelectLabel>
                {['AND', 'OR', 'AND NOT', 'OR NOT'].map((join) => (
                  <SelectItem key={join} value={join}>
                    {join}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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

interface ConditionParamsSelectProps {
  condition: Condition;
  param: keyof Condition['params'];
  values: Condition['params'];
  updateCondition: (data: Partial<Condition>) => void
}

const ConditionParamsSelect = ({
  condition, values, param, updateCondition
}: ConditionParamsSelectProps) => {
  const { data: paramOptions = [], isLoading: loadingParamOptions } = useQuery({
    queryKey: ['columns', 'selectData', condition.column.id],
    queryFn: () => getColumnData(condition.column.id),
    select: (data) => data.data,
    enabled: !!condition.column.id
  });
  return (
    condition.column.type === 'date'
      ? <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`justify-start text-left font-normal ${!condition.params && 'text-muted-foreground'} overflow-x-auto`}
            >
              <CalendarIcon className="mr-2 h-4 min-w-4" />
              {
                condition.params
                  ? (condition.params[param as keyof typeof values] as Array<Date>)
                    .map((d) => `${moment(d, 'do').format('Do')} `)
                  : <span>Pick a date</span>
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="multiple"
              selected={condition.params
                ? condition.params[param as keyof typeof values]
                : []
              }
              onSelect={(newValues) => updateCondition({
                params: { ...condition.params, [param]: newValues } as ReportSelect['conditions'][number]['params']
              })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      : <Skeleton isLoading={loadingParamOptions}>
          <MultiSelect
            label='data'
            options={paramOptions}
            value={condition.params
              ? condition.params[param]
              : []
            }
            onChange={(newValues) => updateCondition({
              params: { ...condition.params, [param]: newValues } as ReportSelect['conditions'][number]['params']
            })}
          />
        </Skeleton>
  );
};

export default Conditions;
