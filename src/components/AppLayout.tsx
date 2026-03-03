import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import Disclaimer from './Disclaimer';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => (
  <div className="min-h-screen bg-background flex flex-col">
    {title && (
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <h1 className="text-lg font-bold text-foreground text-center">{title}</h1>
      </header>
    )}
    <main className="flex-1 overflow-y-auto px-4 py-4 pb-36 max-w-lg mx-auto w-full">
      {children}
    </main>
    <div className="fixed bottom-16 left-0 right-0 z-40">
      <Disclaimer />
    </div>
    <BottomNav />
  </div>
);

export default AppLayout;
