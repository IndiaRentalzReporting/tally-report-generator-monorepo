import {
  useQuery, useMutation, useQueryClient
} from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
  MultiSelect,
  Button
} from '@trg_package/vite/components';
import { DetailedReport } from '@trg_package/schemas-reporting/types';
import { updateAccess } from '@/services/Reports';
import { services as userServices } from '@/services/Users';

const Access: React.FC<{
  report: DetailedReport;
  selectedUsers: Array<string>;
  setSelectedUsers: React.Dispatch<React.SetStateAction<Array<string>>>;
}> = ({
  report,
  selectedUsers,
  setSelectedUsers
}) => {
  const queryClient = useQueryClient();

  const { data: allUsers = [], isFetching: fetchingUsers } = useQuery({
    queryFn: () => userServices.read(),
    select: (data) => data.data.users.map((user) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id
    })),
    queryKey: ['Users', 'getAll'],
  });

  const { mutateAsync: updateAccessMutation, isPending: isUpdatingAccess } = useMutation({
    mutationFn: () => updateAccess(report.id, { users: selectedUsers }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['Reports', report.id, 'Users', 'getAll'] })
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

export default Access;
