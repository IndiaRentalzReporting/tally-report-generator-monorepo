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
  SelectValue
} from '@trg_package/vite/components';
import { Calendar, CalendarIcon, MailIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { services as userServices } from '@/services/Users';
import { updateAccess } from '@/services/Reports';
import { useReports } from '@/providers/ReportsProvider';
import { cn } from '@trg_package/vite/lib/utils';

const ReportAccess: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<Array<string>>([]);

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => userServices.read(),
    select: (data) => data.data.users.map((user) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id
    })),
    queryKey: ['Users', 'getAll']
  });

  const { report } = useReports();
  const { mutateAsync: updateAccessMutation, isPending: isUpdatingAccess } = useMutation({
    mutationFn: () => updateAccess(report.id, selectedUsers),
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

type Frequency = 'daily' | 'weekly' | 'monthly' | 'custom';
const EmailScheduling = () => {
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [timeOfDay, setTimeOfDay] = useState('12:00');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [customInterval, setCustomInterval] = useState('1');

  return (
    <div className="space-y-4 w-full max-w-sm mx-auto">
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select
          value={frequency}
          onValueChange={(value) => setFrequency(value as Frequency)}
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

      {frequency === 'weekly' && (
        <div className="space-y-2">
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
                {selectedDate ? moment(selectedDate).format('EEEE') : <span>Pick a day</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {frequency === 'monthly' && (
        <div className="space-y-2">
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
                {selectedDate ? moment(selectedDate).format('do') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {frequency === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="customInterval">Interval (days)</Label>
          <Input
            id="customInterval"
            type="number"
            min="1"
            value={customInterval}
            onChange={(e) => setCustomInterval(e.target.value)}
          />
        </div>
      )}

      <Button className="w-full" onClick={() => console.log({
        frequency, timeOfDay, selectedDate, customInterval
      })}>
        Save Schedule
      </Button>
    </div>
  );
};

const Mailing: React.FC = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-2'>
          <MailIcon/>
          <span>Mailing</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
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
