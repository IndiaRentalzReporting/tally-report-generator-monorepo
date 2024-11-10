import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Case,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
  SwitchCase,
  MultiSelect
} from '@trg_package/vite/components';
import { PlusCircle } from 'lucide-react';
import { useReports } from '@/providers/ReportsProvider';

const Filters: React.FC = () => {
  const { reportFilters } = useReports();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className='flex gap-2 items-center w-min ml-auto'> <PlusCircle/> Filters</Button>
      </DrawerTrigger>
      <DrawerContent className="px-6 pt-6">
        <DrawerHeader className="px-0 hidden">
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <Card>
          <CardHeader>
            <CardTitle className='flex justify-between items-center' >
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {reportFilters.map((filter) => (
              <SwitchCase control={filter.filterType} >
                <Case value="search">
                  <div className='flex flex-col gap-1.5'>
                    <Label htmlFor={filter.label}>{filter.label}</Label>
                    <Input type='text' placeholder='Select a value' />
                  </div>
                </Case>
                <Case value="select">
                  <div className='flex flex-col gap-1.5'>
                    <MultiSelect
                      title={filter.label}
                      values={[]}
                      options={filter.data ?? []}
                      onChange={() => {}}
                    />
                  </div>
                </Case>
                <Case value="between">
                  <div className='flex flex-col gap-1.5'>
                    <Label htmlFor={filter.label}>{filter.label}</Label>
                    <div className='flex gap-4 items-center'>
                      <Input type='number' placeholder='From' />
                      <Input type='number' placeholder='To' />
                    </div>
                  </div>
                </Case>
              </SwitchCase>
            ))}
          </CardContent>
        </Card>
        <DrawerFooter className="px-0">
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Filters;
