'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import {
  Button,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@trg_package/vite/components';

export const Create = () => {
  const [columns, setColumns] = useState(['Column 1', 'Column2']);
  const [availableColumns, setAvailableColumns] = useState([
    'Column name',
    'Column name',
    'Column name',
    'Column name',
    'Column name',
    'Column name',
    'Column name',
    'Column name'
  ]);

  const addColumn = (columnName: string) => {
    setColumns([...columns, columnName]);
    setAvailableColumns(availableColumns.filter((col) => col !== columnName));
  };

  const removeColumn = (columnName: string) => {
    setColumns(columns.filter((col) => col !== columnName));
    setAvailableColumns([...availableColumns, columnName]);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white p-6">
      <div className="w-64 border-r border-gray-700 pr-4">
        <h2 className="text-xl font-bold mb-4">Available Columns</h2>
        {availableColumns.map((col, index) => (
          <button
            key={index}
            className="w-full text-left p-2 hover:bg-gray-800 rounded mb-2 border border-dashed border-gray-600"
            onClick={() => addColumn(col)}
          >
            {col}
          </button>
        ))}
      </div>
      <div className="flex-1 ml-6">
        <h1 className="text-3xl font-bold mb-6">Report Layout</h1>
        <div className="border border-gray-700 p-4 mb-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, index) => (
                  <TableHead key={index} className="relative">
                    {col}
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      onClick={() => removeColumn(col)}
                    >
                      <X size={12} />
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      Data {rowIndex + 1}-{colIndex + 1}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Report Settings</h2>
          <div className="flex items-center mb-4">
            <label className="w-24">Group By</label>
            <Select>
              <option>Select</option>
            </Select>
          </div>
          <div className="mb-4">
            <h3 className="text-xl mb-2">Conditions</h3>
            <Button variant="outline" className="w-full">
              Add Condition
            </Button>
          </div>
          <div>
            <h3 className="text-xl mb-2">Filters</h3>
            <Button variant="outline" className="w-full">
              Add Filter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
