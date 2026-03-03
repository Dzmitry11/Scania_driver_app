import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, TrendingUp, FileText, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/log', icon: ClipboardList, label: 'Log' },
  { to: '/trends', icon: TrendingUp, label: 'Trends' },
  { to: '/report', icon: FileText, label: 'Report' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
    <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
              isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
