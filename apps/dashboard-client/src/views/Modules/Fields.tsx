import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as z from 'zod';
import { Button, Input, Label, Switch } from '@trg_package/components';
import { State, StateAsProps } from './interface';

const iconSchema = z
  .string()
  .startsWith('<svg xmlns="http://www.w3.org/2000/svg"')
  .endsWith('</svg>');

const Fields: React.FC<StateAsProps> = ({ moduleData, setModuleData }) => {
  const [moduleIcon, setModuleIcon] = React.useState<State['icon']>(
    moduleData.icon
  );
  const iconRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setModuleIcon(moduleData.icon), [moduleData]);

  const renderIcon = async () => {
    const icon = iconRef.current;
    if (!icon) return;
    try {
      const parsedIcon = await iconSchema.parseAsync(moduleIcon);
      setModuleData((prev) => ({ ...prev, icon: parsedIcon }));
      icon.innerHTML = parsedIcon;
    } catch (e) {
      // SHOW TOAST
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Input
          required
          minLength={3}
          placeholder="Module Name"
          value={moduleData.name}
          onChange={(e) =>
            setModuleData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <span className="flex gap-4 items-center">
          <Label htmlFor="isPrivate">Private</Label>
          <Switch
            checked={moduleData.isPrivate}
            name="isPrivate"
            onCheckedChange={(checked) =>
              setModuleData((prev) => ({ ...prev, isPrivate: checked }))
            }
          />
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <Input
          minLength={3}
          placeholder="Module Icon SVG"
          value={moduleIcon ?? ''}
          onChange={(e) => setModuleIcon(e.target.value)}
        />
        <div
          ref={iconRef}
          dangerouslySetInnerHTML={{
            __html: moduleData.icon ?? ''
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
    </div>
  );
};

export default Fields;
