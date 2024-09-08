import { useAuth } from '@/providers/AuthProvider';
import services from '@/services';
import { useQueryClient, useMutation } from '@tanstack/react-query';
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
import { useNavigate } from 'react-router';

const UserSettingsDropdown: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: signOutMutation } = useMutation({
    mutationFn: () => services.Authentication.signOut(),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
      navigate('/sign-in');
    }
  });

  const { user } = useAuth();
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
        <DropdownMenuItem onClick={() => signOutMutation()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserSettingsDropdown;
