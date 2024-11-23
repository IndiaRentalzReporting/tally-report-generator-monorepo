import {
  ChevronsUpDown, CreditCard, KeyIcon, LogOut, UserIcon
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@trg_package/vite/components';
import { useAuth } from '@trg_package/vite/providers';
import ToggleTheme from './ToggleTheme';
import ApiKeys from './apiKey/index';

const UserSettings = () => {
  const { user } = useAuth();
  const { signOut: { isLoading, mutation: signOut } } = useAuth();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <div>
                  <UserIcon />
                </div>
                <span className='flex items-center justify-between gap-2 w-full'>
                  {user?.first_name}
                  <ChevronsUpDown/>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className='w-80'>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.first_name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <CreditCard className="mr-2 !h-4 !w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <div className='flex items-center w-full'>
                <KeyIcon className="mr-2 !h-4 !w-4"/>
                API Keys
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Preferences</DropdownMenuLabel>
            <DropdownMenuItem>
              <ToggleTheme/>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center justify-between w-full">
                <span>Language</span>
                <Select defaultValue="english">
                  <SelectTrigger className="w-24 h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full">
            <Button
              isLoading={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                signOut();
              }}
              variant="default"
              className="w-full"
            >
              <LogOut className="mr-2" />
              <span>Sign Out</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ApiKeys/>
    </Dialog>
  );
};

export default UserSettings;
