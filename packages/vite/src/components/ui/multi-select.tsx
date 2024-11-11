import * as React from 'react';
import { CheckIcon, PlusCircle } from 'lucide-react';
import { cn } from '$/lib/utils';
import {
  Button,
} from './button';
import { Badge } from './badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from './command';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from './popover';

interface MultiSelectProps {
  title?: string
  values: string[]
  options: {
    label: string
    value: string
  }[],
  onChange: (value: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  title,
  values,
  options,
  onChange
}) => {
  const toggleSelection = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((val) => val !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-dashed w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className='mr-1'>{title}</span>
          {values?.length > 0 && (
            <>
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {values.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {values.length} selected
                  </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = values.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleSelection(option.value)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {values.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
