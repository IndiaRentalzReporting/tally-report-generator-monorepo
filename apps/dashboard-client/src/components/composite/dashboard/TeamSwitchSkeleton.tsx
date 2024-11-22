import {
  Card, CardHeader, CardTitle, CardContent
} from '@trg_package/vite/components';
import { Loader2 } from 'lucide-react';
import React from 'react';

const TeamSwitchSkeleton: React.FC = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-[300px]">
        <CardHeader className="pb-2 mb-6">
          <CardTitle className="text-center text-lg">Switching Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
);

export default TeamSwitchSkeleton;
