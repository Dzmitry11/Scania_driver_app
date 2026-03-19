import { AlertTriangle } from 'lucide-react';

const Disclaimer = () => (
  <div className="bg-muted px-4 py-2 text-center text-xs text-muted-foreground border-t border-border">
    <div className="flex items-center justify-center gap-1.5">
      <AlertTriangle className="h-3 w-3 shrink-0" />
      <span>Non-diagnostic companion for Scania/TRATON drivers. No medical advice or treatment guidance. Use for documentation and safe next-step decisions.</span>
    </div>
  </div>
);

export default Disclaimer;
