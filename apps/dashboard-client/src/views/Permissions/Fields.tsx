import React from 'react';
import {
  DataTable
} from '@trg_package/vite/components';
import { StateAsProps } from './interface';
import { columns } from './columns';

const Fields: React.FC<StateAsProps> = ({
  fields,
  form
}) => (
    <div>
      <DataTable
        columns={columns(form)
          .filter((column) => column.id !== 'Role Name')
          .filter((column) => column.id !== 'Permission Actions')
        }
        data={fields}
        grouping={{
          rowGrouping: [],
          setRowGrouping: () => null
        }}
        selection={{
          rowSelection: {},
          setRowSelection: () => null
        }}
      />
    </div>
);

export default Fields;
