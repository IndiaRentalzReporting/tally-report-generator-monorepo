import { cn } from '$/lib/utils';
import { If, Then, Else } from '../Conditionals';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
}

const SkeletonOverlay = ({ className, ...props }: Omit<Props, 'isLoading'>) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-muted pointer-events-none',
      className
    )}
    {...props}
  />
);

const Skeleton = ({ className, children, isLoading }: Props) => (
  <If condition={isLoading}>
    <Then>
      <SkeletonOverlay className={cn('h-20 w-full', className)} />
    </Then>
    <Else>{children}</Else>
  </If>
);

export { Skeleton, SkeletonOverlay };
