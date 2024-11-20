import {
  Dialog,
  DialogTrigger,
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  MultiSelect,
  Skeleton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Calendar
} from '@trg_package/vite/components';
import { CalendarIcon, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { cn } from '@trg_package/vite/lib/utils';
import { ScheduleSelect } from '@trg_package/schemas-reporting/types';
import { services as userServices } from '@/services/Users';
import { getUsersWithAccess, updateAccess, updateSchedule } from '@/services/Reports';
import { useReports } from '@/providers/ReportsProvider';

const ReportAccess: React.FC = () => {
  const { report } = useReports();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<Array<string>>(
    report.access.map((user) => user.userId)
  );

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => userServices.read(),
    select: (data) => data.data.users.map((user) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id
    })),
    queryKey: ['Users', 'getAll'],
  });

  const { mutateAsync: updateAccessMutation, isPending: isUpdatingAccess } = useMutation({
    mutationFn: () => updateAccess(report.id, { users: selectedUsers }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Reports', 'getOne', report.id] });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Report Acesss</CardTitle>
        <CardDescription>
          Add all the users to whom you want to send this mail to.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-6'>
        <Skeleton isLoading={fetchingUsers}>
          <MultiSelect
            options={allUsers}
            values={selectedUsers}
            onChange={setSelectedUsers}
            title="Users"
          />
          <Button
            type="submit"
            onClick={() => updateAccessMutation()}
            isLoading={isUpdatingAccess}
            className='self-start'
          >
            Save changes
          </Button>
        </Skeleton>
      </CardContent>
    </Card>
  );
};

const EmailScheduling = () => {
  const { report } = useReports();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState(report.schedule.users.map((user) => user.userId));
  const [frequency, setFrequency] = useState(report.schedule.frequency);
  const [timeOfDay, setTimeOfDay] = useState(report.schedule.timeOfDay);
  const [selectedDate, setSelectedDate] = useState<Array<Date> | undefined>([new Date()]);
  const [customInterval, setCustomInterval] = useState('1');

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => getUsersWithAccess(report.id),
    select: (data) => data.data.users.map(({ user }) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id
    })),
    queryKey: ['Report', 'Users', 'getAll']
  });

  console.log({
    allUsers,
    selectedUsers
  });

  const { mutateAsync: updateScheduleMutation, isPending: isUpdatingSchedule } = useMutation({
    mutationFn: () => updateSchedule(report.id, {
      users: selectedUsers,
      schedule: {
        frequency,
        timeOfDay,
        daysOfMonth: (selectedDate?.map((date) => Number(moment(date).format('Do')))) ?? [],
        daysOfWeek: (selectedDate?.map((date) => Number(moment(date).format('E')))) ?? [],
        customInterval: Number(customInterval),
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Reports', 'getOne', report.id] });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Mailing</CardTitle>
        <CardDescription>
          Set the users and the email frequency for your report.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Skeleton isLoading={fetchingUsers}>
          <MultiSelect
            options={allUsers}
            values={selectedUsers}
            onChange={setSelectedUsers}
            title="Users"
          />
        </Skeleton>
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(value) => setFrequency(value as ScheduleSelect['frequency'])}
          >
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeOfDay">Time of Day</Label>
          <Input
            id="timeOfDay"
            type="time"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
          />
        </div>
        {
          frequency === 'weekly'
          && <div className="space-y-2">
              <Label>Day of Week</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.map((date) => moment(date).format('E')) : <span>Pick a day</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="multiple"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    captionLayout='dropdown-buttons'

                  />
                </PopoverContent>
              </Popover>
            </div>
        }
        {
          frequency === 'monthly'
          && <div className="space-y-2">
              <Label>Day of Month</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.map((date) => moment(date).format('Do')) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="multiple"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
        }
        {
          frequency === 'custom'
          && <div className="space-y-2">
              <Label htmlFor="customInterval">Interval (days)</Label>
              <Input
                id="customInterval"
                type="number"
                min="1"
                value={customInterval}
                onChange={(e) => setCustomInterval(e.target.value)}
              />
            </div>
        }
        <Button
          className='self-start mt-2'
          onClick={() => updateScheduleMutation()}
          isLoading={isUpdatingSchedule}
          disabled={isUpdatingSchedule || fetchingUsers}
        >
          Save Schedule
        </Button>
      </CardContent>
    </Card>
  );
};

const Mailing: React.FC = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-2'>
          <Settings/>
          <span>Settings</span>
        </Button>
      </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
           className="sm:max-w-[475px]"
        >
        <DialogHeader>
          <DialogTitle className='text-left'>Edit profile</DialogTitle>
          <DialogDescription className='text-left'>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="Scheduling" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="Scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="Access">Access</TabsTrigger>
          </TabsList>
          <TabsContent value="Scheduling">
            <EmailScheduling/>
          </TabsContent>
          <TabsContent value="Access">
            <ReportAccess/>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
);

export default Mailing;
