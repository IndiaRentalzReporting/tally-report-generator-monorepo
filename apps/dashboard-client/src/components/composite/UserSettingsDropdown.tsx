import { useAuth } from '@/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@trg_package/components';
import { CircleUser } from 'lucide-react';

import React, { useMemo } from 'react';

const UserSettingsDropdown: React.FC = () => {
  const {
    user,
    signOut: { mutation: signOut, isLoading }
  } = useAuth();
  const userName = useMemo(
    () => `${user?.first_name} ${user?.last_name}`,
    [user]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <Button
          onClick={() => signOut()}
          isLoading={isLoading}
          variant="ghost"
          size="default"
          className=" w-full"
        >
          Logout
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserSettingsDropdown;
