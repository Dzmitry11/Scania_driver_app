import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { saveBPReading, getBPReadings } from '@/lib/storage';
import { toast } from 'sonner';

const WeeklyVitals = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [context, setContext] = useState('');
  const readings = getBPReadings();

  const save = () => {
    if (!systolic || !diastolic) return;
    saveBPReading({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: pulse ? Number(pulse) : undefined,
      context: context || undefined,
    });
    setSystolic(''); setDiastolic(''); setPulse(''); setContext('');
    toast.success('Blood pressure reading saved!');
  };

  return (
    <AppLayout title="Weekly Vitals">
      <div className="space-y-4 animate-fade-in">
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Blood Pressure</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Systolic (mmHg)</Label><Input type="number" value={systolic} onChange={e => setSystolic(e.target.value)} placeholder="120" /></div>
            <div><Label>Diastolic (mmHg)</Label><Input type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)} placeholder="80" /></div>
          </div>
          <div><Label>Pulse (optional)</Label><Input type="number" value={pulse} onChange={e => setPulse(e.target.value)} placeholder="72" /></div>
          <div><Label>Context (optional)</Label><Input value={context} onChange={e => setContext(e.target.value)} placeholder="e.g. seated, rested, after exercise" /></div>
          <Button onClick={save} className="w-full" disabled={!systolic || !diastolic}>Save Reading</Button>
        </Card>

        {readings.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">HISTORY</h3>
            <div className="space-y-2">
              {[...readings].reverse().slice(0, 10).map(r => (
                <Card key={r.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{r.systolic}/{r.diastolic} mmHg</p>
                    {r.pulse && <p className="text-xs text-muted-foreground">Pulse: {r.pulse}</p>}
                    {r.context && <p className="text-xs text-muted-foreground">{r.context}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default WeeklyVitals;
