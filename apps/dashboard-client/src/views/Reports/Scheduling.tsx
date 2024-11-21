import { useQuery, useMutation } from '@tanstack/react-query';
import { DetailedReport, ScheduleSelect } from '@trg_package/schemas-reporting/types';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
  MultiSelect,
  Label,
  TimePicker,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  Button
} from '@trg_package/vite/components';
import { getUsersWithAccess, updateSchedule } from '@/services/Reports';

const Scheduling: React.FC<{
  report: DetailedReport;
  selectedUsers: Array<string>;
  setSelectedUsers: React.Dispatch<React.SetStateAction<Array<string>>>;
}> = ({
  report,
  selectedUsers,
  setSelectedUsers
}) => {
  const [frequency, setFrequency] = useState(report.schedule?.frequency ?? 'daily');
  const [timeOfDay, setTimeOfDay] = useState<Date | undefined>(() => {
    const initialDate = new Date();
    const [hours = 0, minutes = 0] = report.schedule ? report.schedule.timeOfDay.split(':').map(Number) : [0, 0];
    initialDate.setHours(hours, minutes, 0, 0);
    return initialDate;
  });
  const [daysOfWeek, setDaysOfWeek] = useState(report.schedule?.daysOfWeek ?? []);
  const [daysOfMonth, setDaysOfMonth] = useState(report.schedule?.daysOfMonth ?? []);
  const [customInterval, setCustomInterval] = useState(report.schedule?.customInterval);

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => getUsersWithAccess(report.id),
    select: (data) => data.data.users.map(({ user }) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id
    })),
    queryKey: ['Reports', report.id, 'Users', 'getAll']
  });

  const { mutateAsync: updateScheduleMutation, isPending: isUpdatingSchedule } = useMutation({
    mutationFn: () => updateSchedule(report.id, {
      users: selectedUsers,
      schedule: {
        frequency,
        timeOfDay: timeOfDay?.toTimeString().slice(0, 5) ?? '00:00:00',
        daysOfMonth,
        daysOfWeek,
        customInterval,
      }
    }),
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
        {
          frequency === 'weekly'
          && <div className="space-y-2">
              <Label>Day of Week</Label>
              <MultiSelect
                options={weeks}
                values={daysOfWeek.map(String)}
                onChange={(values) => setDaysOfWeek(values.map(Number))}
                title="Days"
              />
            </div>
        }
        {
          frequency === 'monthly'
          && <div className="space-y-2">
              <Label>Day of Month</Label>
              <MultiSelect
                options={months}
                values={daysOfMonth.map(String)}
                onChange={(values) => setDaysOfMonth(values.map(Number))}
                title="Days"
              />
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
                value={String(customInterval)}
                onChange={(e) => setCustomInterval(Number(e.target.value))}
              />
            </div>
        }
        <div className="space-y-2">
          <Label htmlFor="timeOfDay">Time of Day</Label>
          <TimePicker
            date={timeOfDay}
            setDate={setTimeOfDay}
          />
        </div>
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

export default Scheduling;

const weeks = [
  {
    label: 'Monday',
    value: '1'
  },
  {
    label: 'Tuesday',
    value: '2'
  },
  {
    label: 'Wednesday',
    value: '3'
  },
  {
    label: 'Thursday',
    value: '4'
  },
  {
    label: 'Friday',
    value: '5'
  },
  {
    label: 'Saturday',
    value: '6'
  },
  {
    label: 'Sunday',
    value: '7'
  }
];

const months = [
  {
    label: 'January',
    value: '1'
  },
  {
    label: 'February',
    value: '2'
  },
  {
    label: 'March',
    value: '3'
  },
  {
    label: 'April',
    value: '4'
  },
  {
    label: 'May',
    value: '5'
  },
  {
    label: 'June',
    value: '6'
  },
  {
    label: 'July',
    value: '7'
  },
  {
    label: 'August',
    value: '8'
  },
  {
    label: 'September',
    value: '9'
  },
  {
    label: 'October',
    value: '10'
  },
  {
    label: 'November',
    value: '11'
  },
  {
    label: 'December',
    value: '12'
  }
];
