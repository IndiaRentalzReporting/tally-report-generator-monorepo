import React, { useState } from 'react';
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
  MultiSelect,
  Else,
  If,
  Then,
  CardDescription,
  When,
  Separator
} from '@trg_package/vite/components';
import { PlusCircle } from 'lucide-react';
import { GeneratedReportFilters, RuntimeFilters } from '@trg_package/schemas-reporting/types';

const Filters: React.FC<{
  isFetchingReport: boolean
  filtersState: RuntimeFilters,
  reportFilters: Array<GeneratedReportFilters>,
  setFiltersState: React.Dispatch<React.SetStateAction<RuntimeFilters>>
}> = ({
  reportFilters,
  isFetchingReport,
  filtersState,
  setFiltersState
}) => {
  const [localFiltersState, setLocalFiltersState] = useState<RuntimeFilters>(filtersState);

  const handleFilterChange = (label: string, value: any) => {
    setLocalFiltersState((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" className='flex gap-2 items-center w-min'> <PlusCircle/> Filters</Button>
      </DrawerTrigger>
      <DrawerContent className="px-6 pt-6">
        <DrawerHeader className="px-0 hidden">
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <Card>
          <CardHeader>
            <CardTitle className='flex justify-between items-center'>
              Filters
            </CardTitle>
            <CardDescription>
              <If condition={!!reportFilters.length}>
                <Then>
                  Narrow down the report based on these filters
                </Then>
                <Else>
                  No filters available for this report
                </Else>
              </If>
            </CardDescription>
          </CardHeader>
          <When condition={!!reportFilters.length}>
            <CardContent className="flex flex-col gap-4">
              {reportFilters.map((filter, index) => (
                <>
                  <SwitchCase control={filter.filterType} >
                    <Case value="search">
                      <div className='flex flex-col gap-1.5'>
                        <Label htmlFor={filter.label}>{filter.label}</Label>
                        <Input
                          type='text'
                          placeholder='Select a value'
                          value={(localFiltersState[filter.fieldName] as { value: string })?.value || ''}
                          onChange={({ target: { value } }) => handleFilterChange(
                            filter.fieldName,
                            { value }
                          )}
                        />
                      </div>
                    </Case>
                    <Case value="select">
                      <div className='flex flex-col gap-1.5'>
                        <MultiSelect
                          title={filter.label}
                          values={(localFiltersState[filter.fieldName] as {
                            value: string[]
                          })?.value || []}
                          options={filter.data ?? []}
                          onChange={(value) => handleFilterChange(filter.fieldName, { value })}
                        />
                      </div>
                    </Case>
                    <Case value="between">
                      <div className='flex flex-col gap-1.5'>
                        <Label htmlFor={filter.label}>{filter.label}</Label>
                        <div className='flex gap-4 items-center'>
                        <Input
                          type="number"
                          placeholder="From"
                          value={(localFiltersState[filter.fieldName] as { from: string })?.from || ''}
                          onChange={({ target: { value } }) => handleFilterChange(
                            filter.fieldName,
                            { ...localFiltersState[filter.fieldName], from: value }
                          )}
                        />
                        <Input
                          type="number"
                          placeholder="To"
                          value={(localFiltersState[filter.fieldName] as { to: string })?.to || ''}
                          onChange={({ target: { value } }) => handleFilterChange(
                            filter.fieldName,
                            { ...localFiltersState[filter.fieldName], to: value }
                          )}
                        />
                        </div>
                      </div>
                    </Case>
                  </SwitchCase>
                  {index !== reportFilters.length - 1 && <Separator />}
                </>
              ))}
              <Button
                isLoading={isFetchingReport}
                type="submit"
                className="w-full mt-auto"
                onClick={() => setFiltersState(localFiltersState)}
              >
                Apply Filters
              </Button>
            </CardContent>
          </When>
        </Card>
        <DrawerFooter className="px-0">
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Filters;
