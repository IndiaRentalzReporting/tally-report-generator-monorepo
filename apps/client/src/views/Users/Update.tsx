import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button
} from '@/components/ui';
import { RegisterUser } from '@/models';
import services from '@/services';
import Fields from './Fields';

const Update: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);

  const [registerData, setRegisterData] = useState<RegisterUser>({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });

  const { data: userData } = useQuery({
    queryFn: () => services.Users.getOne(id),
    select: (data) => data.data.user,
    queryKey: ['getOne', 'users', id]
  });

  useEffect(() => {
    if (!userData) return;
    setRegisterData({ ...userData, password: '' });
  }, [userData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Update User</CardTitle>
        <CardDescription>Update user details</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          // onSubmit={handleSignUp}
          className="grid gap-4"
        >
          <Fields userData={registerData} setUserData={setRegisterData} />
          <Button type="submit" className="w-min" isLoading={loading}>
            Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Update;
