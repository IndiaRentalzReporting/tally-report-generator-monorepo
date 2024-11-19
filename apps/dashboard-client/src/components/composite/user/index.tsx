import {
  ChevronsUpDown, CreditCard, KeyIcon, LogOut, UserIcon, Users
} from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
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
import { useAuth, useTheme } from '@trg_package/vite/providers';
import ApiKey from './ApiKey';
import ToggleTheme from './ToggleTheme';

const UserSettings = () => {
  const { setTheme } = useTheme();
  const { user } = useAuth();
  const { signOut: { isLoading, mutation: signOut } } = useAuth();

  return (
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
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">{user?.first_name}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Users className="mr-2 !h-4 !w-4" />
          <span>Switch Team</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 !h-4 !w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <KeyIcon className="mr-2 !h-4 !w-4"/>
            API Keys
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <ApiKey/>
          </DropdownMenuPortal>
        </DropdownMenuSub>
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
  );
};

export default UserSettings;
