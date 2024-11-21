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
  TabsTrigger
} from '@trg_package/vite/components';
import { Settings as SettingsIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Access from './Access';
import Scheduling from './Scheduling';
import { useReports } from '@/providers/ReportsProvider';

const Settings: React.FC = () => {
  const { report } = useReports();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      queryClient.invalidateQueries({ queryKey: ['Reports', report.id, 'getOne'] });
    }
    setOpen(open);
  };

  const [selectedAccessUsers, setSelectedAccessUsers] = useState(
    report.access.map((user) => user.userId)
  );

  const [selectedSchedulingUsers, setSelectedSchedulingUsers] = useState(
    report.schedule?.users.map((user) => user.userId) ?? []
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-2'>
          <SettingsIcon/>
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
            <Scheduling
              report={report}
              selectedUsers={selectedSchedulingUsers}
              setSelectedUsers={setSelectedSchedulingUsers}
            />
          </TabsContent>
          <TabsContent value="Access">
            <Access
              report={report}
              selectedUsers={selectedAccessUsers}
              setSelectedUsers={setSelectedAccessUsers}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
