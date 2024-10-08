import { LoadingSpinner } from '.';

export const RedirectingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4">
      <LoadingSpinner />
      <h1 className="text-2xl font-semibold text-foreground">Redirecting...</h1>
    </div>
  </div>
);
