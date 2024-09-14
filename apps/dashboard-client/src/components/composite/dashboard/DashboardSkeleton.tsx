import { SkeletonOverlay } from '@trg_package/components';

export default function DashboardSkeletonOverlay() {
  return (
    <div className="grid relative min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden md:flex flex-col p-4 space-y-4 border-r">
        <SkeletonOverlay className="h-14 w-3/4 mb-4" />
        <SkeletonOverlay className="h-8 w-full" />
        <SkeletonOverlay className="h-8 w-full" />
        <SkeletonOverlay className="h-8 w-full" />
        <SkeletonOverlay className="h-8 w-full" />
        <SkeletonOverlay className="h-8 w-full" />
      </div>

      <div className="flex flex-col">
        <header className="border-b p-4">
          <div className="flex justify-between items-center">
            <SkeletonOverlay className="h-8 w-32" />
            <div className="flex space-x-4 items-center">
              <SkeletonOverlay className="h-8 w-8 rounded-full" />
              <SkeletonOverlay className="h-6 w-24" />
            </div>
          </div>
        </header>

        <main className="flex-grow p-6">
          <div className="space-y-6">
            <SkeletonOverlay className="h-10 w-1/4" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <SkeletonOverlay className="h-40 w-full" />
                  <SkeletonOverlay className="h-4 w-3/4" />
                  <SkeletonOverlay className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
