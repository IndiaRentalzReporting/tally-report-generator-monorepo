import React from 'react';
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Skeleton
} from '@trg_package/vite/components';
import { useQuery } from '@tanstack/react-query';
import { StateAsProps } from './interface';
import { services } from '@/services/reports';

const Fields: React.FC<StateAsProps> = ({ reportData, setReportData }) => {
  const { data: baseEntities, isFetching: fetchingTables } = useQuery({
    queryFn: async () => services.getTables(),
    select: (data) => data.data.tables,
    queryKey: ['roles', 'getAll']
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Input
          required
          minLength={3}
          placeholder="Name"
          value={reportData.name}
          onChange={(e) =>
            setReportData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Select
          onValueChange={(baseEntity) =>
            setReportData((prev) => ({ ...prev, baseEntity }))
          }
          value={reportData.baseEntity}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Base Entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tables</SelectLabel>
              <Skeleton isLoading={fetchingTables}>
                {baseEntities?.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name}
                  </SelectItem>
                ))}
              </Skeleton>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Fields;
