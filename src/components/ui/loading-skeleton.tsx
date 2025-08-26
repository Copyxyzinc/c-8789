import { Skeleton } from './skeleton';

export const MessageSkeleton = () => (
  <div className="flex gap-4 p-4 animate-fade-in">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const ChatListSkeleton = () => (
  <div className="space-y-2 p-2 animate-fade-in">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 flex-1" />
      </div>
    ))}
  </div>
);

export const WelcomeScreenSkeleton = () => (
  <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
    <div className="w-full max-w-3xl space-y-8 px-4">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  </div>
);