import { Edit } from 'lucide-react';
import React, {
  useMemo, useState, useCallback, useEffect
} from 'react';
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
  When,
  Button
} from '@trg_package/vite/components';
import { ColumnOperators } from '@trg_package/schemas-reporting/types';
import { Column, useReports } from '@/providers/ReportsProvider';
import Select from './Select';

interface IUpdateEntityProps {
  columnName: Column['column']['name'];
}

export const UpdateColumn: React.FC<IUpdateEntityProps> = ({ columnName }) => {
  const { columns, updateColumn } = useReports();
  const [isOpen, setIsOpen] = useState(false);

  const selectedColumn = useMemo(
    () => columns.find((col) => col.column.name === columnName),
    [columns, columnName]
  );

  const [localExtra, setLocalExtra] = useState<Column['extra']>(
    selectedColumn?.extra ?? {
      name: '',
      heading: '',
      operation: '',
      params: '',
      showTotal: false
    }
  );

  // Reset localExtra when the drawer opens
  useEffect(() => {
    if (isOpen && selectedColumn) {
      setLocalExtra(selectedColumn.extra);
    }
  }, [isOpen, selectedColumn]);

  const operations = useMemo(
    () => (selectedColumn ? ColumnOperators[selectedColumn.column.type] : []),
    [selectedColumn]
  );

  const values = useMemo(
    () => (selectedColumn
      ? (ColumnOperators[selectedColumn.column.type].find(
        (op) => op.operator === selectedColumn.extra.operation
      )?.params ?? [])
      : []),
    [selectedColumn]
  );

  const handleSave = useCallback(() => {
    if (selectedColumn) {
      updateColumn(selectedColumn.column.name, 'extra', localExtra);
    }
    setIsOpen(false);
  }, [selectedColumn, updateColumn, localExtra]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
              <Input id="columnName" value={localExtra.name} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={localExtra.heading}
                onChange={({ target }) => setLocalExtra((prev) => ({
                  ...prev,
                  heading: target.value
                }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operation">Operation</Label>
              <Select
                label="Operation"
                value={localExtra.operation || ''}
                options={operations.map((op) => ({
                  label: op.operator,
                  value: op.operator
                }))}
                onChange={(operatorName) => setLocalExtra((prev) => ({
                  ...prev,
                  operation: operatorName
                }))
                }
              />
            </div>

            <When condition={!!values.length}>
              {values.map((value) => (
                <Input
                  key={value}
                  placeholder={value}
                  value={localExtra.params}
                  onChange={({ target }) => {
                    setLocalExtra((prev) => ({
                      ...prev,
                      params: target.value
                    }));
                  }}
                />
              ))}
            </When>

            <When condition={selectedColumn?.column.type === 'number'}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={localExtra.showTotal}
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
            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </CardContent>
        </Card>

        <DrawerFooter className="px-0">
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
