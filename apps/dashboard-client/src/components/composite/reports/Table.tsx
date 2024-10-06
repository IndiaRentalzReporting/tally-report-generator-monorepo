import React from 'react';
import {
  Table as TableComponent,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  When,
  Button
} from '@trg_package/vite/components';
import { X } from 'lucide-react';
import { useReports } from '@/providers/ReportsProvider';
import { useNav } from '@/providers/NavigationProvider';

const Table: React.FC = () => {
  const { currentModule } = useNav();
  const { columns, removeColumn } = useReports();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <When condition={!!currentModule}>
        <div className="flex items-center w-full justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">{currentModule}</h1>
        </div>
      </When>
      <div className="flex flex-col gap-6  rounded-lg shadow-sm w-full h-full relative">
        <TableComponent>
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index} className="relative">
                  {col.name}
                  <Button
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 h-auto"
                    onClick={() => removeColumn(col)}
                  >
                    <X size={12} />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody />
        </TableComponent>
      </div>
    </main>
  );
};

export default Table;
