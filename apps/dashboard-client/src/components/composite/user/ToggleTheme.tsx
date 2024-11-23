import { Computer, Moon, Sun } from 'lucide-react';

import {
  Button
} from '@trg_package/vite/components';
import { useTheme } from '@trg_package/vite/providers';

const ToggleTheme: React.FC = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full">
      <span>Theme</span>
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme('light')}
          className='h-auto w-8'
        >
          <Sun className='!h-4 !w-4'/>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme('dark')}
          className='h-auto w-8'
        >
          <Moon className='!h-4 !w-4'/>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme('system')}
          className='h-auto w-8'
        >
          <Computer className='!h-4 !w-4'/>
        </Button>
      </div>
    </div>
  );
};

export default ToggleTheme;
