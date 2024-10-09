import { Edit } from 'lucide-react';
import React, { Suspense, useMemo } from 'react';
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
  Skeleton,
  Checkbox,
  Input,
  Label,
  When
} from '@trg_package/vite/components';
import {
  ColumnOperation,
  ColumnSelect
} from '@trg_package/schemas-reporting/types';
import { useReports } from '@/providers/ReportsProvider';
import ConditionSelect from './ConditionSelect';

interface IUpdateEntityProps {
  column: ColumnSelect;
}

export const UpdateColumn: React.FC<IUpdateEntityProps> = ({
  column: { name, type }
}) => {
  const { extras, updateExtras } = useReports();
  const extra = useMemo(
    () => extras.find((ex) => ex.name === name),
    [extras, name]
  );

  const operations = useMemo(() => ColumnOperation[type], [type]);

  const values = useMemo(
    () =>
      extra?.operation
        ? (ColumnOperation[type].find(
            (op) => op.operationType == extra?.operation
          )?.operationParams ?? [])
        : [],
    [extra]
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Edit size={100} className=" cursor-pointer opacity-5" />
      </DrawerTrigger>
      <DrawerContent className="px-6">
        <DrawerHeader className="px-0">
          <DrawerTitle>Column Settings</DrawerTitle>
        </DrawerHeader>
        <Card className="w-full relative">
          <CardContent className="pt-6 space-y-4">
            <Suspense fallback={<Skeleton isLoading />}>
              <div className="space-y-2">
                <Label htmlFor="columnName">Column Name</Label>
                <Input id="columnName" value={extra?.name} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={extra?.heading}
                  onChange={({ target }) =>
                    updateExtras(name, { heading: target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation">Operation</Label>
                <ConditionSelect
                  label="Operation"
                  value={extra?.operation || ''}
                  options={operations.map((op) => ({
                    label: op.operationType,
                    value: op.operationType
                  }))}
                  onChange={(operatorName) =>
                    updateExtras(name, {
                      operation: operatorName
                    })
                  }
                />
              </div>

              <When condition={!!values.length}>
                {values.map((value) => (
                  <Input
                    key={value}
                    placeholder={value}
                    type={extra?.params}
                    onChange={({ target }) => {
                      updateExtras(name, { params: target.value });
                    }}
                  />
                ))}
              </When>

              <When condition={!!extra?.showTotal}>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={extra?.showTotal}
                    id="showTotal"
                    onCheckedChange={(showTotal) =>
                      updateExtras(name, { showTotal: Boolean(showTotal) })
                    }
                  />
                  <Label htmlFor="showTotal">Show Total</Label>
                </div>
              </When>
            </Suspense>
          </CardContent>
        </Card>

        <DrawerFooter className="px-0">
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
