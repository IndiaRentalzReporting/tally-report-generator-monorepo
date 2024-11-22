import { LoadingSpinner } from './ui/loader';

export const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <div className="text-center flex flex-col items-center space-y-4">
      <LoadingSpinner className='w-8 h-8' />
      <h1 className="text-2xl font-semibold text-foreground">Loading...</h1>
    </div>
  </div>
);
