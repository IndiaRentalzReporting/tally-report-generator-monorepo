import { Link } from 'react-router-dom';
import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label
} from '@trg_package/components';
import { RegisterUser, TenantInsert } from '@trg_package/schemas-auth/types';
import { useAuth } from '@trg_package/providers';

const initialTenantState: TenantInsert = {
  name: ''
};

const initialUserState: RegisterUser = {
  email: '',
  password: '',
  first_name: '',
  last_name: ''
};

export function SignupForm() {
  const {
    onboard: { isLoading, mutation: onboard }
  } = useAuth();

  const [tenantData, setTenantData] =
    useState<TenantInsert>(initialTenantState);
  const [userData, setUserData] = useState<RegisterUser>(initialUserState);

  const handleFormChange = <T extends Object>(
    e: ChangeEvent<HTMLInputElement>,
    callback: React.Dispatch<React.SetStateAction<T>>
  ) => {
    const { value, name } = e.target;
    callback((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onboard({
      tenant: tenantData,
      user: userData
    });
    setTenantData(initialTenantState);
    setUserData(initialUserState);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSignUp}>
            <div className="grid gap-2">
              <Label htmlFor="company_name">Comapny Name</Label>
              <Input
                id="company_name"
                name="name"
                onChange={(e) => handleFormChange(e, setTenantData)}
                placeholder="Max"
                required
                value={tenantData.name}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  name="first_name"
                  onChange={(e) => handleFormChange(e, setUserData)}
                  placeholder="Max"
                  required
                  value={userData.first_name}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  name="last_name"
                  onChange={(e) => handleFormChange(e, setUserData)}
                  placeholder="Robinson"
                  required
                  value={userData.last_name}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                onChange={(e) => handleFormChange(e, setUserData)}
                placeholder="m@example.com"
                required
                type="email"
                value={userData.email}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                onChange={(e) => handleFormChange(e, setUserData)}
                placeholder="********"
                type="password"
                value={userData.password}
              />
            </div>
            <Button className="w-full" isLoading={isLoading} type="submit">
              Create an Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link className="underline" to="/sign-in">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
