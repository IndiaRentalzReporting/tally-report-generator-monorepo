import { ColumnType, ModuleColumns } from '@fullstack_package/interfaces';
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
  SelectValue
} from '@/components/ui';
import { DataTable } from '@/components/composite';

export interface ColumnData {
  [key: string]: string;
}
export interface IColumnDetails {
  name: string;
  type: ModuleColumns;
}

interface ITableCreation {
  columnDetails: Array<IColumnDetails>;
  setColumnDetails: React.Dispatch<React.SetStateAction<Array<IColumnDetails>>>;
}

const TableCreation: React.FC<ITableCreation> = ({
  columnDetails,
  setColumnDetails
}) => {
  const [columnData, setColumnData] = useState<{
    name: string;
    type: ModuleColumns;
  }>({
    name: '',
    type: 'TEXT'
  });

  const tableData: ColumnData[] = useMemo(
    () => [
      columnDetails.reduce(
        (agg, column) => ({
          ...agg,
          [column.name]:
            ColumnType[column.type as keyof typeof ColumnType]?.example || 'N/A'
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

  const handleAddColumn: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (columnDetails.some((col) => col.name === columnData.name)) {
      // show toast error
      return;
    }
    setColumnDetails((prev) => [...prev, columnData]);
    setColumnData({
      name: '',
      type: 'TEXT'
    });
  };

  const handleRemoveColumn: React.MouseEventHandler<HTMLButtonElement> = ({
    currentTarget
  }) => {
    const { id } = currentTarget;
    setColumnDetails((prev) => prev.filter((el) => el.name !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="flex gap-4">
        <Input
          required
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
          onValueChange={(type: ModuleColumns) =>
            setColumnData((prev) => ({ ...prev, type }))
          }
          value={columnData.type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              {Object.keys(ColumnType).map((type, index) => (
                <SelectItem key={index} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          type="submit"
          disabled={!columnData.name || !columnData.type}
          onClick={handleAddColumn}
        >
          Add Column
        </Button>
      </form>
      <DataTable columns={tableColumn} data={tableData} />
    </div>
  );
};

export default TableCreation;
