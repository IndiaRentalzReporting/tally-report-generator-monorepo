import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input,
  Switch
} from '@trg_package/vite/components';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ form }) => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 w-full items-center">
        <div className='flex-grow'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder="Module Name"
                    {...field}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 items-center">
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem>
                <FormLabel >Is Private</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={field.disabled}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className='flex items-center gap-4 w-full'>
        <div className='flex-grow'>
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel >Icon</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder="Icon SVG"
                    {...field}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Link
          to="https://lucide.dev/icons/"
          target="_blank"
          className="w-min"
        >
          <Button type="button">Browse Icons</Button>
        </Link>
      </div>
    </div>
);

export default Fields;
