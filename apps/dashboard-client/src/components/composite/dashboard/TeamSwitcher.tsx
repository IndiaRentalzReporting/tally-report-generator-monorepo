import {
  ChevronsUpDown,
  Package2,
  PlusCircle
} from 'lucide-react';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  SidebarMenuButton,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  useSidebar,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label
} from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import moment from 'moment';

const TeamSwitcher: React.FC = () => {
  const { isMobile } = useSidebar();
  const { user, teams } = useAuth();

  const [teamName, setTeamName] = useState('');

  if (!user) return null;

  const { tenant } = user;

  return (
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Package2/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {tenant.name}
                </span>
                <span className="truncate text-xs opacity-55">{moment(tenant.lastSyncedAt).format('lll')}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team) => (
              <Team name={team.name} id={team.id}/>
            ))}
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem className="gap-2 p-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Add Team</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className='text-left'>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Enter a name for your new team.
            </DialogDescription>
          </DialogHeader>
          <form className='flex flex-col gap-4'>
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-right">
                Team Name
              </Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter className='self-start'>
              <Button type="submit">
                Create Team
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};

const Team: React.FC<{
  name: string,
  id: string,
}> = ({
  name,
  id
}) => {
  const { switchTeam: { mutation } } = useAuth();

  return (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      key={name}
      onClick={() => mutation({ tenant_id: id })}
      className="justify-between p-2"
    >
      <span>{name}</span>
    </DropdownMenuItem>
  );
};

export default TeamSwitcher;
