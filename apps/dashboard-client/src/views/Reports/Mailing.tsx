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
  CardDescription
} from '@trg_package/vite/components';
import { MailIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { services as userServices } from '@/services/Users';
import { updateAccess } from '@/services/Reports';
import { useReports } from '@/providers/ReportsProvider';

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

const EmailScheduling: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Email Scheduling</CardTitle>
        <CardDescription>
          Set the email frequency and time of day for your report should be mailed to users.
        </CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
);

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
