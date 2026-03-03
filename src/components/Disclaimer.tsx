import { AlertTriangle } from 'lucide-react';

const Disclaimer = () => (
  <div className="bg-muted px-4 py-2 text-center text-xs text-muted-foreground border-t border-border">
    <div className="flex items-center justify-center gap-1.5">
      <AlertTriangle className="h-3 w-3 shrink-0" />
      <span>This app does not provide medical advice, diagnosis, or treatment. For documentation only. Consult a healthcare professional.</span>
    </div>
  </div>
);

export default Disclaimer;
