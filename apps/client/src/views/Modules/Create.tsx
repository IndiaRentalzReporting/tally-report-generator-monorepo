import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { SelectContent } from '@radix-ui/react-select';
import { LucideIcon, icons } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Select,
  SelectItem
} from '@/components/ui';
import services from '@/services';

const CreateModule: React.FC = () => {
  const [moduleName, setModuleName] = React.useState<string>('');

  const { mutateAsync: createModule, isPending: loadingCreateModule } =
    useMutation({
      mutationFn: () => services.module.createOne({ name: moduleName })
    });
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Module</CardTitle>
        <CardDescription>
          Create Modules for storing your company data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createModule();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            required
            minLength={3}
            placeholder="Module Name"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
          />
          <Button
            type="submit"
            className="w-min mt-2"
            isLoading={loadingCreateModule}
          >
            Create Module
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateModule;
