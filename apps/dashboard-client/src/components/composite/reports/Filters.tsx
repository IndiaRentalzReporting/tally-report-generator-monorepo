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
  Separator,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@trg_package/vite/components';
import {
  CalendarIcon, FilterIcon, FilterX
} from 'lucide-react';
import { GeneratedReportFilters, RuntimeFilters } from '@trg_package/schemas-reporting/types';
import moment from 'moment';

const Filters: React.FC<{
  isFetchingReport: boolean;
  filtersState: RuntimeFilters;
  reportFilters: Array<GeneratedReportFilters>;
  setFiltersState: React.Dispatch<React.SetStateAction<RuntimeFilters>>;
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
      [label]: value
    }));
  };

  const handleRemoveFilters = () => {
    setFiltersState({});
    setLocalFiltersState({});
  };

  const handleSubmitFilters = () => {
    const filteredLocalState = Object.entries(localFiltersState).reduce((acc, [key, value]) => {
      if (
        value
        && (
          ('value' in value && value.value !== '' && value.value.length > 0)
          || ('from' in value && value.from !== '')
          || ('to' in value && value.to !== '')
        )
      ) {
        acc[key] = value;
      }
      return acc;
    }, {} as RuntimeFilters);

    setFiltersState(filteredLocalState);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary" className='flex gap-2 items-center w-min'>
          <FilterIcon />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-6 pt-6">
        <DrawerHeader className="px-0 hidden">
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <Card>
          <CardHeader>
            <div className='flex items-start gap-4'>
              <div className='space-y-1.5 mr-auto'>
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
              </div>
              <Button
                className='flex gap-2 items-center w-min ml-auto'
                variant="destructive"
                onClick={handleRemoveFilters}
                disabled={!Object.entries(localFiltersState).length}
              >
                <FilterX />
                <span className='text-sm'>Clear Filters</span>
              </Button>
            </div>
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
                        <If condition={filter.fieldName.includes('_date')}>
                          <Then>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start text-left font-normal overflow-x-auto"
                                >
                                  <CalendarIcon className="mr-2" />
                                  {(localFiltersState[filter.fieldName] as {
                                    from: string;
                                    to: string
                                  })
                                    ? `${moment((localFiltersState[filter.fieldName] as {
                                      from: string; to: string
                                    }).from).format('YYYY-MM-DD')} - ${moment((localFiltersState[filter.fieldName] as {
                                      from: string;
                                      to: string
                                    }).to).format('YYYY-MM-DD')} `
                                    : 'Pick a date range'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="range"
                                  initialFocus
                                  selected={{
                                    from: (localFiltersState[filter.fieldName])
                                      ? moment((localFiltersState[filter.fieldName] as {
                                        from: string;
                                        to: string
                                      }).from).toDate()
                                      : new Date(),
                                    to: (localFiltersState[filter.fieldName])
                                      ? moment((localFiltersState[filter.fieldName] as {
                                        from: string;
                                        to: string
                                      }).to).toDate()
                                      : new Date()
                                  }}
                                  onSelect={(newValues) => {
                                    if (!newValues) {
                                      handleFilterChange(filter.fieldName, { from: '', to: '' });
                                      return;
                                    }
                                    const { from, to } = newValues;
                                    handleFilterChange(
                                      filter.fieldName,
                                      {
                                        from: moment(from).format('YYYY-MM-DD'),
                                        to: moment(to).format('YYYY-MM-DD')
                                      }
                                    );
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </Then>
                          <Else>
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
                          </Else>
                        </If>
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
                disabled={JSON.stringify(localFiltersState) === JSON.stringify(filtersState)}
                onClick={handleSubmitFilters}
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
