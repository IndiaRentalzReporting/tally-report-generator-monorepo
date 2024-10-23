import React from 'react';
import {
  Check, ChevronsUpDown, X
} from 'lucide-react';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '$/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '$/components/ui/popover';
import { Button } from '$/components/ui/button';
import { Else, If, Then } from '../Conditionals';
import { Badge } from './badge';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  label: string
  className?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  label,
  className = '',
  value,
  onChange
}) => {
  const [open, setOpen] = React.useState(false);

  const toggleSelection = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((val) => val !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeValue = (valueToRemove: string) => {
    onChange(value.filter((val) => val !== valueToRemove));
  };

  return (
    <div className={`w-full ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <If condition={value.length > 0}>
                <Then>
                  <div className='flex gap-2 items-center'>
                    {value.map((selectedValue) => {
                      const option = options.find((opt) => opt.value === selectedValue);
                      if (!option) return null;
                      return (
                        <Badge key={selectedValue} variant="secondary">
                            {option.label}
                            <button
                            type='button'
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={() => removeValue(selectedValue)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </button>
                          </Badge>
                      );
                    })}
                  </div>
                </Then>
                <Else>
                  {`Select ${label}...`}
                </Else>
              </If>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>{`No ${label} selected`}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleSelection(option.value)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value.includes(option.value) ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
