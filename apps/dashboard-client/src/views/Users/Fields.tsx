import React from 'react';
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input
} from '@trg_package/vite/components';
import { StateAsProps } from './interface';

const Fields: React.FC<StateAsProps> = ({ form }) => (
  <div className="flex flex-col gap-4">
    <div className="flex w-full gap-4">
      <div className="flex-grow">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel >First Name</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder="Max"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex-grow">
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel >Last Name</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder="Robinson"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel >Email</FormLabel>
          <FormControl>
            <Input
              type='email'
              placeholder="m@example.com"
              {...field}
            />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel >Password</FormLabel>
          <FormControl>
            <Input
              type='password'
              placeholder="********"
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
