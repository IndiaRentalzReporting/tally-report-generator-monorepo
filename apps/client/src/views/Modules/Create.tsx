import React, { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Switch,
  Label
} from '@/components/ui';
import services from '@/services';
import { Module } from '@/models';

const iconSchema = z
  .string()
  .startsWith('<svg xmlns="http://www.w3.org/2000/svg"')
  .endsWith('</svg>');

type State = Pick<Module, 'name' | 'isPrivate' | 'icon'>;
const initialState: State = {
  name: '',
  isPrivate: false,
  icon: ''
};

const CreateModule: React.FC = () => {
  const iconRef = useRef<HTMLDivElement | null>(null);
  const [moduleIcon, setModuleIcon] = React.useState<State['icon']>('');
  const [moduleDetails, setModuleDetails] = React.useState<State>(initialState);

  const queryClient = useQueryClient();
  const { mutateAsync: createModule, isPending: loadingCreateModule } =
    useMutation({
      mutationFn: () => services.module.createOne(moduleDetails),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['modules', 'getAll'] });
      },
      onSettled: () => {
        setModuleIcon(initialState.icon);
        setModuleDetails(initialState);
      }
    });

  const modifySvgDimensions = (
    svgStr: string,
    newWidth: number,
    newHeight: number
  ): string => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    svgElement.setAttribute('width', String(newWidth));
    svgElement.setAttribute('height', String(newHeight));

    const serializer = new XMLSerializer();
    const modifiedSvgStr = serializer.serializeToString(svgElement);
    return modifiedSvgStr;
  };

  const renderIcon = async () => {
    const icon = iconRef.current;
    if (!icon) return;
    try {
      const parsedIcon = await iconSchema.parseAsync(moduleIcon);
      const modifiedParsedIcon = modifySvgDimensions(parsedIcon, 20, 20);
      setModuleDetails((prev) => ({ ...prev, icon: modifiedParsedIcon }));
      icon.innerHTML = parsedIcon;
    } catch (e) {
      // SHOW TOAST
      console.error(e);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <p>Create Module</p>
          <span className="flex gap-4 items-center">
            <Label htmlFor="isPrivate">Private</Label>
            <Switch
              checked={moduleDetails.isPrivate}
              name="isPrivate"
              onCheckedChange={(checked) =>
                setModuleDetails((prev) => ({ ...prev, isPrivate: checked }))
              }
            />
          </span>
        </CardTitle>
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
            value={moduleDetails.name}
            onChange={(e) =>
              setModuleDetails((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <div className="flex gap-4 items-center">
            <Input
              minLength={3}
              placeholder="Module Icon SVG"
              value={moduleIcon}
              onChange={(e) => setModuleIcon(e.target.value)}
            />
            <div
              ref={iconRef}
              dangerouslySetInnerHTML={{
                __html: moduleDetails.icon
              }}
              className="border border-border rounded-md p-2"
            />
            <Button
              type="button"
              disabled={!moduleIcon}
              className="w-min"
              onClick={renderIcon}
            >
              Render Icon
            </Button>
            <Link
              to="https://lucide.dev/icons/"
              target="_blank"
              className="w-min"
              onClick={renderIcon}
            >
              <Button type="button">Browse Icons</Button>
            </Link>
          </div>
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
