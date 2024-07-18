import { ColumnType, ModuleColumns } from '@fullstack_package/interfaces';
import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
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

  return (
    <div className="flex gap-4">
      <Input
        required
        minLength={3}
        placeholder="Column Name"
        value={columnData.name}
        onChange={(e) =>
          setColumnData((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <Select
        required
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
        disabled={!columnData.name || !columnData.type}
        onClick={() => {
          setColumnDetails((prev) => [...prev, columnData]);
          setColumnData({
            name: '',
            type: 'TEXT'
          });
        }}
      >
        Add Column
      </Button>
    </div>
  );
};

export default TableCreation;
