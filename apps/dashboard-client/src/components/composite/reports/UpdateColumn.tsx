import { Edit } from 'lucide-react';
import React, { useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Card,
  CardContent,
  Checkbox,
  Input,
  Label,
  When
} from '@trg_package/vite/components';
import { ColumnOperations, ReportSelect } from '@trg_package/schemas-reporting/types';
import { Column, useReports } from '@/providers/ReportsProvider';
import Select from './Select';

interface IUpdateEntityProps {
  column: Column;
}

const UpdateColumn: React.FC<IUpdateEntityProps> = ({ column }) => {
  const {
    columns, updateColumn, setGroupBy
  } = useReports();

  const [open, setOpen] = useState(false);
  const [localExtra, setLocalExtra] = useState(column);

  const selectedColumn = columns.find((col) => col.column.name === column.column.name);

  const operations = Object.keys(ColumnOperations).filter((operatorName) => {
    const operation = ColumnOperations[operatorName as keyof typeof ColumnOperations];
    const operationFor = operation.for;
    return selectedColumn?.column.type ? operationFor.includes(selectedColumn.column.type) : [];
  });

  const handleClose = (open: boolean) => {
    setOpen(open);
    if (selectedColumn && !open) {
      setTimeout(() => updateColumn(selectedColumn.column.id, { ...localExtra }), 500);
    }
  };

  return (
    <div className="flex items-center justify-center h-[30vh] hover:bg-muted/50 rounded-md">
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerTrigger>
          <Edit size={100} className="cursor-pointer opacity-5" />
        </DrawerTrigger>
        <DrawerContent className="px-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>Column Settings</DrawerTitle>
          </DrawerHeader>
          <Card className="w-full relative">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="columnName">Column Name</Label>
                <Input id="columnName" value={column.column.name} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={localExtra.heading || ''}
                  onChange={({ target: { value: heading } }) => setLocalExtra((prev) => ({
                    ...prev,
                    heading
                  }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation">Operation</Label>
                <Select
                  label="Operation"
                  value={localExtra.operation}
                  options={operations.map((op) => ({
                    label: op,
                    value: op
                  }))}
                  onChange={(operation) => {
                    setGroupBy((prev) => prev.filter(
                      (group) => group.column.displayName !== column.column.displayName
                    ));
                    setLocalExtra((prev) => ({ ...prev, operation: operation as ReportSelect['columns'][number]['operation'] }));
                  }}
                />
              </div>

              <When condition={selectedColumn?.column.type === 'number'}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={localExtra.column.type === 'number'}
                    id="showTotal"
                    onCheckedChange={(showTotal) => setLocalExtra((prev) => ({
                      ...prev,
                      showTotal: Boolean(showTotal)
                    }))
                    }
                  />
                  <Label htmlFor="showTotal">Show Total</Label>
                </div>
              </When>
            </CardContent>
          </Card>

          <DrawerFooter className="px-0">
            <DrawerClose>Cancel</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default UpdateColumn;
