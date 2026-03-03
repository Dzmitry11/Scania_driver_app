import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { getIllnessEpisodes, addIllnessEpisode, updateIllnessEpisode } from '@/lib/storage';
import type { IllnessEpisode, SymptomEntry, TemperatureReading, MedicationEntry } from '@/types/health';
import { toast } from 'sonner';
import { AlertTriangle, Plus, X } from 'lucide-react';

const SYMPTOM_OPTIONS = ['Cough', 'Sore throat', 'Headache', 'Nausea', 'Fatigue', 'Fever',
  'Shortness of breath', 'Chest pain', 'Body aches', 'Runny nose', 'Diarrhea', 'Dizziness', 'Loss of appetite'];

const IllnessEpisodePage = () => {
  const episodes = getIllnessEpisodes();
  const activeEpisode = episodes.find(e => e.active);
  const [showNew, setShowNew] = useState(false);

  // New episode state
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [tempValue, setTempValue] = useState('');
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('');
  const [notes, setNotes] = useState('');

  const toggleSymptom = (name: string) => {
    if (symptoms.find(s => s.name === name)) {
      setSymptoms(symptoms.filter(s => s.name !== name));
    } else {
      setSymptoms([...symptoms, { name, severity: 5 }]);
    }
  };

  const updateSeverity = (name: string, severity: number) => {
    setSymptoms(symptoms.map(s => s.name === name ? { ...s, severity } : s));
  };

  const startNewEpisode = () => {
    const ep: IllnessEpisode = {
      id: crypto.randomUUID(),
      startDate: new Date().toISOString(),
      active: true,
      symptoms,
      temperatures: tempValue ? [{ timestamp: new Date().toISOString(), valueCelsius: Number(tempValue) }] : [],
      bloodPressures: [],
      tests: [],
      medications: medName ? [{ name: medName, time: medTime || new Date().toLocaleTimeString() }] : [],
      notes,
    };
    addIllnessEpisode(ep);
    toast.success('Illness episode started');
    setShowNew(false);
    setSymptoms([]); setTempValue(''); setMedName(''); setMedTime(''); setNotes('');
  };

  const addTemp = (ep: IllnessEpisode) => {
    if (!tempValue) return;
    const updated = {
      ...ep,
      temperatures: [...ep.temperatures, { timestamp: new Date().toISOString(), valueCelsius: Number(tempValue) } as TemperatureReading],
    };
    updateIllnessEpisode(updated);
    setTempValue('');
    toast.success('Temperature added');
  };

  const addMed = (ep: IllnessEpisode) => {
    if (!medName) return;
    const updated = {
      ...ep,
      medications: [...ep.medications, { name: medName, time: medTime || new Date().toLocaleTimeString() } as MedicationEntry],
    };
    updateIllnessEpisode(updated);
    setMedName(''); setMedTime('');
    toast.success('Medication recorded');
  };

  const endEpisode = (ep: IllnessEpisode) => {
    updateIllnessEpisode({ ...ep, active: false, endDate: new Date().toISOString() });
    toast.success('Episode ended');
  };

  // Emergency check
  const hasEmergencySignals = activeEpisode && (
    activeEpisode.temperatures.some(t => t.valueCelsius >= 40) ||
    activeEpisode.symptoms.some(s => ['Chest pain', 'Shortness of breath'].includes(s.name) && s.severity >= 8)
  );

  return (
    <AppLayout title="Illness Episode">
      <div className="space-y-4 animate-fade-in">
        {hasEmergencySignals && (
          <Card className="border-destructive bg-destructive/5 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">Safety Notice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  If you feel unsafe or symptoms are severe, seek urgent medical help or call local emergency services.
                  This notice is based on self-reported data.
                </p>
              </div>
            </div>
          </Card>
        )}

        {activeEpisode ? (
          <>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Active Episode</h3>
                <span className="text-xs text-muted-foreground">Started {new Date(activeEpisode.startDate).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Symptoms:</strong> {activeEpisode.symptoms.map(s => `${s.name} (${s.severity}/10)`).join(', ') || 'None'}</p>
                {activeEpisode.temperatures.length > 0 && (
                  <p><strong>Last temp:</strong> {activeEpisode.temperatures[activeEpisode.temperatures.length - 1].valueCelsius}°C</p>
                )}
                {activeEpisode.medications.length > 0 && (
                  <p><strong>Medications:</strong> {activeEpisode.medications.map(m => m.name).join(', ')}</p>
                )}
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h3 className="font-semibold text-sm">Add Temperature</h3>
              <div className="flex gap-2">
                <Input type="number" step="0.1" value={tempValue} onChange={e => setTempValue(e.target.value)} placeholder="37.0°C" />
                <Button onClick={() => addTemp(activeEpisode)} size="sm">Add</Button>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h3 className="font-semibold text-sm">Record Medication</h3>
              <div className="flex gap-2">
                <Input value={medName} onChange={e => setMedName(e.target.value)} placeholder="Medication name" />
                <Input type="time" value={medTime} onChange={e => setMedTime(e.target.value)} className="w-28" />
                <Button onClick={() => addMed(activeEpisode)} size="sm">Add</Button>
              </div>
            </Card>

            <Button variant="destructive" onClick={() => endEpisode(activeEpisode)} className="w-full">End Episode</Button>
          </>
        ) : showNew ? (
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Start New Episode</h3>
              <button onClick={() => setShowNew(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div>
              <Label>Symptoms</Label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {SYMPTOM_OPTIONS.map(s => (
                  <button key={s} onClick={() => toggleSymptom(s)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                      symptoms.find(x => x.name === s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'
                    }`}>{s}</button>
                ))}
              </div>
            </div>
            {symptoms.length > 0 && (
              <div className="space-y-2">
                <Label>Severity per symptom</Label>
                {symptoms.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs w-28 truncate">{s.name}</span>
                    <Slider value={[s.severity]} onValueChange={([v]) => updateSeverity(s.name, v)} min={1} max={10} step={1} className="flex-1" />
                    <span className="text-xs w-6 text-right">{s.severity}</span>
                  </div>
                ))}
              </div>
            )}
            <div><Label>Temperature (°C)</Label><Input type="number" step="0.1" value={tempValue} onChange={e => setTempValue(e.target.value)} placeholder="37.0" /></div>
            <div><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Progression, triggers, exposures..." /></div>
            <Button onClick={startNewEpisode} className="w-full" disabled={symptoms.length === 0}>Start Episode</Button>
          </Card>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No active illness episode</p>
            <Button onClick={() => setShowNew(true)} className="gap-2"><Plus className="h-4 w-4" />Start New Episode</Button>
          </div>
        )}

        {/* Past episodes */}
        {episodes.filter(e => !e.active).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">PAST EPISODES</h3>
            {episodes.filter(e => !e.active).reverse().map(ep => (
              <Card key={ep.id} className="p-3 mb-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{new Date(ep.startDate).toLocaleDateString()} – {ep.endDate ? new Date(ep.endDate).toLocaleDateString() : '?'}</span>
                  <span>{ep.symptoms.length} symptoms</span>
                </div>
                <p className="text-sm mt-1">{ep.symptoms.map(s => s.name).join(', ')}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default IllnessEpisodePage;
