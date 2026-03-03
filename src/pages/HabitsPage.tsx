import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { saveHabitLog, getHabitLogs } from '@/lib/storage';
import { toast } from 'sonner';

const HabitsPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const logs = getHabitLogs();
  const todayLog = logs.find(l => l.date === today);

  const [alcohol, setAlcohol] = useState('0');
  const [cigarettes, setCigarettes] = useState('0');
  const [snus, setSnus] = useState('0');
  const [vape, setVape] = useState('0');

  const save = () => {
    saveHabitLog({
      id: crypto.randomUUID(), date: today,
      alcoholUnits: Number(alcohol), cigarettes: Number(cigarettes),
      snusPortions: Number(snus), vapeSessions: Number(vape),
    });
    toast.success('Habits logged!');
  };

  return (
    <AppLayout title="Daily Habits">
      <div className="space-y-4 animate-fade-in">
        {todayLog ? (
          <Card className="p-4 text-center">
            <p className="text-primary font-semibold">Today's habits already logged ✓</p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div>Alcohol: {todayLog.alcoholUnits} units</div>
              <div>Cigarettes: {todayLog.cigarettes}</div>
              <div>Snus: {todayLog.snusPortions} portions</div>
              <div>Vape: {todayLog.vapeSessions} sessions</div>
            </div>
          </Card>
        ) : (
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Log Today's Habits</h3>
            <div><Label>Alcohol (units/drinks)</Label><Input type="number" min="0" value={alcohol} onChange={e => setAlcohol(e.target.value)} /></div>
            <div><Label>Cigarettes (count)</Label><Input type="number" min="0" value={cigarettes} onChange={e => setCigarettes(e.target.value)} /></div>
            <div><Label>Snus (portions)</Label><Input type="number" min="0" value={snus} onChange={e => setSnus(e.target.value)} /></div>
            <div><Label>Vape (sessions)</Label><Input type="number" min="0" value={vape} onChange={e => setVape(e.target.value)} /></div>
            <Button onClick={save} className="w-full">Save Habits</Button>
          </Card>
        )}

        {logs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">RECENT LOGS</h3>
            {[...logs].reverse().slice(0, 7).map(l => (
              <Card key={l.id} className="p-3 mb-2">
                <p className="text-xs text-muted-foreground mb-1">{new Date(l.date).toLocaleDateString()}</p>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <span>🍷 {l.alcoholUnits}</span>
                  <span>🚬 {l.cigarettes}</span>
                  <span>📦 {l.snusPortions}</span>
                  <span>💨 {l.vapeSessions}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default HabitsPage;
