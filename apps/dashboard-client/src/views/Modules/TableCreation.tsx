/* eslint-disable react/no-unstable-nested-components */
import {
  PGColumnDataType,
  PGColumnDataTypeValue,
  PGColumnDataTypeExample,
  PGColumnDataTypeValueFunction
} from '@trg_package/pg-orm';
import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  When
} from '@trg_package/components';
import { DataTable } from '@/components/composite';

export interface ColumnData {
  [key: string]: string;
}
export interface IColumnDetails {
  name: string;
  type: PGColumnDataType;
  value: PGColumnDataTypeValue;
  example: PGColumnDataTypeExample;
}
const defaultColumnType: PGColumnDataType = 'TEXT';
const defaultColumnData: IColumnDetails = {
  name: '',
  type: defaultColumnType,
  value: PGColumnDataType[defaultColumnType].value(),
  example: PGColumnDataType[defaultColumnType].example
};
export interface IColumnParameter {
  type: PGColumnDataTypeValueFunction;
  [x: number]: number;
}
const defaultColumnParameter: { type: PGColumnDataTypeValueFunction } = {
  type: PGColumnDataType[defaultColumnType].value
};

interface ITableCreation {
  columnDetails: Array<IColumnDetails>;
  setColumnDetails: React.Dispatch<React.SetStateAction<Array<IColumnDetails>>>;
}

const TableCreation: React.FC<ITableCreation> = ({
  columnDetails,
  setColumnDetails
}) => {
  const [columnData, setColumnData] =
    useState<IColumnDetails>(defaultColumnData);

  const [columnParameters, setColumnParameters] = useState<IColumnParameter>(
    defaultColumnParameter
  );

  const parameters = useMemo(() => {
    const { type, ...rest } = columnParameters;
    return rest;
  }, [columnParameters]);

  const handleAddColumn: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (columnDetails.some((col) => col.name === columnData.name)) return;

    const { type, ...rest } = columnParameters;
    const parameterValues = Object.values(rest);
    setColumnDetails((prev) => [
      ...prev,
      {
        ...columnData,
        value: type(...parameterValues)
      }
    ]);
    setColumnParameters(defaultColumnParameter);
    setColumnData(defaultColumnData);
  };

  const handleRemoveColumn: React.MouseEventHandler<HTMLButtonElement> = ({
    currentTarget
  }) => {
    const { id } = currentTarget;
    setColumnDetails((prev) => prev.filter((el) => el.name !== id));
  };

  const handleSelectChange = (type: keyof typeof PGColumnDataType): void => {
    const columnType = PGColumnDataType[type].value;
    const hasParameters = columnType.length;
    let parameter = {};
    for (let i = 0; i < hasParameters; i++) {
      parameter = { ...parameter, [i]: null };
    }
    setColumnData((prev) => ({
      ...prev,
      type,
      value: columnType(),
      example: PGColumnDataType[type].example
    }));
    setColumnParameters({ type: columnType, ...parameter });
  };

  const handleParameterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setColumnParameters((prev) => ({
      ...prev,
      [Number(key)]: Number(e.target.value)
    }));
  };

  const tableData: ColumnData[] = useMemo(
    () => [
      columnDetails.reduce(
        (agg, { name, example }) => ({
          ...agg,
          [name]: example || 'N/A'
        }),
        {} as ColumnData
      )
    ],
    [columnDetails]
  );

  const tableColumn: ColumnDef<ColumnData>[] = useMemo(
    () =>
      columnDetails.map((column) => ({
        accessorKey: column.name,
        header: () => {
          return (
            <div className="flex gap-2 items-center">
              {column.name}
              <Button
                id={column.name}
                variant="ghost"
                className="px-2 py-1"
                onClick={handleRemoveColumn}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        cell: ({ cell }) => (
          <p className="text-muted-foreground">{cell.getValue() as string}</p>
        )
      })),
    [columnDetails]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <Input
          minLength={2}
          placeholder="Column Name"
          value={columnData.name}
          name="name"
          onChange={(e) =>
            setColumnData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Select
          required
          name="type"
          onValueChange={handleSelectChange}
          value={columnData.type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              {Object.keys(PGColumnDataType).map((type) => {
                const columnType = type;
                return (
                  <SelectItem key={type} value={columnType}>
                    {type}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <When condition={!!Object.keys(parameters).length}>
          {Object.keys(Object.keys(parameters)).map((key) => (
            <Input
              placeholder="Data Type Parameter"
              name={`${key}-parameter`}
              onChange={(e) => handleParameterChange(e, key)}
            />
          ))}
        </When>
        <Button
          type="button"
          onClick={handleAddColumn}
          disabled={!columnData.name || !columnData.type}
        >
          Add Column
        </Button>
      </div>
      <DataTable columns={tableColumn} data={tableData} />
    </div>
  );
};

export default TableCreation;
