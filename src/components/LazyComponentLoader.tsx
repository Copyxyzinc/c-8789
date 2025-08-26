import { lazy, Suspense } from 'react';
import { WelcomeScreenSkeleton, ChatListSkeleton } from './ui/loading-skeleton';

// Lazy load heavy components
export const LazySettingsPanel = lazy(() => import('./SettingsPanel'));
export const LazyMessageList = lazy(() => import('./MessageList'));

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper = ({ children, fallback }: LazyWrapperProps) => (
  <Suspense fallback={fallback || <div className="animate-pulse">Loading...</div>}>
    {children}
  </Suspense>
);

export const LazySettingsPanelWrapper = (props: any) => (
  <LazyWrapper fallback={<div className="animate-fade-in">Loading settings...</div>}>
    <LazySettingsPanel {...props} />
  </LazyWrapper>
);

export const LazyMessageListWrapper = (props: any) => (
  <LazyWrapper fallback={<ChatListSkeleton />}>
    <LazyMessageList {...props} />
  </LazyWrapper>
);