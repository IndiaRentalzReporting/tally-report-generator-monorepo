import { Edit } from 'lucide-react';
import React, { Suspense } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Card,
  CardContent,
  Skeleton,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@trg_package/vite/components';

interface IUpdateEntityProps {
  module: {
    name: string;
    id: string;
    type: string;
  };
}

export const UpdateColumn: React.FC<IUpdateEntityProps> = ({
  module: { id, type }
}) => (
  <Drawer>
    <DrawerTrigger asChild>
      <Edit size={100} className=" cursor-pointer opacity-5" />
    </DrawerTrigger>
    <DrawerContent className="px-6">
      <DrawerHeader className="px-0">
        <DrawerTitle>Column Settings</DrawerTitle>
      </DrawerHeader>
      <Card className="w-full relative">
        <CardContent className="pt-6 space-y-4">
          <Suspense fallback={<Skeleton isLoading />}>
            <div className="space-y-2">
              <Label htmlFor="columnName">Column Name</Label>
              <Input id="columnName" value=" Column Name" readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input id="heading" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operation">Operation</Label>
              <Select defaultValue="select">
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">Select</SelectItem>
                  {/* Add more options as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="showTotal" />
              <Label htmlFor="showTotal">Show Total</Label>
            </div>
          </Suspense>
        </CardContent>
      </Card>

      <DrawerFooter className="px-0">
        <DrawerClose>Cancel</DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);
