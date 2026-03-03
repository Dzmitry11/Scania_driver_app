import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCycleEntries, saveCycleEntry } from '@/lib/storage';
import { toast } from 'sonner';

const WomensHealthPage = () => {
  const entries = getCycleEntries();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [pain, setPain] = useState([5]);
  const [notes, setNotes] = useState('');

  const save = () => {
    if (!startDate) return;
    saveCycleEntry({
      id: crypto.randomUUID(), startDate, endDate: endDate || undefined,
      flowIntensity: flow, painLevel: pain[0], notes,
    });
    setStartDate(''); setEndDate(''); setNotes('');
    toast.success('Cycle entry saved!');
  };

  return (
    <AppLayout title="Women's Health">
      <div className="space-y-4 animate-fade-in">
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Log Menstrual Cycle</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Start Date</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div><Label>End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
          </div>
          <div>
            <Label>Flow Intensity</Label>
            <Select value={flow} onValueChange={v => setFlow(v as typeof flow)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Pain Level ({pain[0]}/10)</Label><Slider value={pain} onValueChange={setPain} min={1} max={10} step={1} /></div>
          <div><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notes..." /></div>
          <Button onClick={save} className="w-full" disabled={!startDate}>Save Entry</Button>
        </Card>

        {entries.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">HISTORY</h3>
            {[...entries].reverse().map(e => (
              <Card key={e.id} className="p-3 mb-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{new Date(e.startDate).toLocaleDateString()}{e.endDate ? ` – ${new Date(e.endDate).toLocaleDateString()}` : ''}</span>
                  <span className="capitalize">{e.flowIntensity} flow</span>
                </div>
                <p className="text-sm mt-1">Pain: {e.painLevel}/10{e.notes ? ` • ${e.notes}` : ''}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default WomensHealthPage;
