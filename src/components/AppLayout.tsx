import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import Disclaimer from './Disclaimer';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => (
  <div className="min-h-screen flex flex-col">
    {title && (
      <header className="sticky top-0 z-40 bg-primary border-b border-primary px-4 py-3">
        <div className="relative max-w-lg mx-auto">
          <h1 className="text-lg font-bold text-primary-foreground text-center">{title}</h1>
          <img
            src={`${import.meta.env.BASE_URL}scania-simbol.png`}
            alt="Scania logo"
            className="absolute right-0 top-1/2 h-7 w-auto -translate-y-1/2 object-contain"
          />
        </div>
      </header>
    )}
    <main className="flex-1 overflow-y-auto px-4 py-4 pb-36 max-w-lg mx-auto w-full bg-background/70 backdrop-blur-[1px]">
      {children}
    </main>
    <div className="fixed bottom-16 left-0 right-0 z-40">
      <Disclaimer />
    </div>
    <BottomNav />
  </div>
);

export default AppLayout;
