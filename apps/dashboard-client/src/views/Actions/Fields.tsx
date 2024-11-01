import React from 'react';
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input
} from '@trg_package/vite/components';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ form }) => (
  <div className="flex flex-col gap-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Action Name"
              {...field}
            />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default Fields;
