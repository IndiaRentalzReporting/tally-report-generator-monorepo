import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as z from 'zod';
import { Module } from '@/models';
import { Button, Input, Label, Switch } from '@/components/ui';

interface State extends Pick<Module, 'name' | 'icon' | 'isPrivate'> {}
interface IFieldsProps {
  moduleDetails: State;
  setModuleDetails: Dispatch<SetStateAction<State>>;
}

const iconSchema = z
  .string()
  .startsWith('<svg xmlns="http://www.w3.org/2000/svg"')
  .endsWith('</svg>');

const Fields: React.FC<IFieldsProps> = ({
  moduleDetails,
  setModuleDetails
}) => {
  const [moduleIcon, setModuleIcon] = React.useState<Module['icon']>(
    moduleDetails.icon
  );
  const iconRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setModuleIcon(moduleDetails.icon), [moduleDetails]);

  const renderIcon = async () => {
    const icon = iconRef.current;
    if (!icon) return;
    try {
      const parsedIcon = await iconSchema.parseAsync(moduleIcon);
      setModuleDetails((prev) => ({ ...prev, icon: parsedIcon }));
      icon.innerHTML = parsedIcon;
    } catch (e) {
      // SHOW TOAST
    }
  };
  return (
    <>
      <div className="flex gap-4 items-center">
        <Input
          required
          minLength={3}
          placeholder="Module Name"
          value={moduleDetails.name}
          onChange={(e) =>
            setModuleDetails((prev) => ({ ...prev, name: e.target.value }))
          }
        />
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
      </div>
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
    </>
  );
};

export default Fields;
