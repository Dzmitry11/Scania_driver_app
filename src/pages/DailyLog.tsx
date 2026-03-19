import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveMorningLog, saveMiddayLog, saveEveningLog, getMorningLogs, getMiddayLogs, getEveningLogs } from '@/lib/storage';
import { toast } from 'sonner';
import { Sun, Cloud, Moon, Check } from 'lucide-react';

const FOOD_TAGS = ['Healthy', 'Fast food', 'Home cooked', 'Skipped', 'Light', 'Heavy'];

const DailyLog = () => {
  const [params] = useSearchParams();
  const initialTab = params.get('tab') || 'morning';
  const today = new Date().toISOString().split('T')[0];

  // Check existing
  const hasMorning = getMorningLogs().some(l => l.date === today);
  const hasMidday = getMiddayLogs().some(l => l.date === today);
  const hasEvening = getEveningLogs().some(l => l.date === today);

  // Morning state
  const [wakeUp, setWakeUp] = useState('07:00');
  const [breakfast, setBreakfast] = useState('');
  const [breakfastTags, setBreakfastTags] = useState<string[]>([]);
  const [sleepQuality, setSleepQuality] = useState([7]);
  const [morningWellbeing, setMorningWellbeing] = useState([7]);

  // Midday state
  const [lunch, setLunch] = useState('');
  const [lunchTags, setLunchTags] = useState<string[]>([]);
  const [middayStress, setMiddayStress] = useState([5]);

  // Evening state
  const [dinner, setDinner] = useState('');
  const [dinnerTags, setDinnerTags] = useState<string[]>([]);
  const [eveningStress, setEveningStress] = useState([5]);
  const [steps, setSteps] = useState('');
  const [exerciseMin, setExerciseMin] = useState('');
  const [computerMin, setComputerMin] = useState('');
  const [wellbeing, setWellbeing] = useState([7]);
  const [hasSymptoms, setHasSymptoms] = useState(false);
  const [symptomDesc, setSymptomDesc] = useState('');

  const toggleTag = (tags: string[], setTags: (t: string[]) => void, tag: string) => {
    setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  };

  const TagSelector = ({ tags, setTags }: { tags: string[]; setTags: (t: string[]) => void }) => (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {FOOD_TAGS.map(t => (
        <button key={t} onClick={() => toggleTag(tags, setTags, t)}
          className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
            tags.includes(t) ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'
          }`}>{t}</button>
      ))}
    </div>
  );

  const saveMorning = () => {
    saveMorningLog({
      id: crypto.randomUUID(), date: today, wakeUpTime: wakeUp,
      breakfast, breakfastTags, sleepQuality: sleepQuality[0], wellbeing: morningWellbeing[0],
    });
    toast.success('Morning check-in saved!');
  };

  const saveMidday = () => {
    saveMiddayLog({
      id: crypto.randomUUID(), date: today, lunch, lunchTags, stressLevel: middayStress[0],
    });
    toast.success('Midday check-in saved!');
  };

  const saveEvening = () => {
    saveEveningLog({
      id: crypto.randomUUID(), date: today, dinner, dinnerTags,
      stressLevel: eveningStress[0], steps: Number(steps) || 0,
      exerciseMinutes: Number(exerciseMin) || 0, computerMinutes: Number(computerMin) || 0,
      wellbeing: wellbeing[0], hasSymptomsToday: hasSymptoms, symptomDescription: symptomDesc || undefined,
    });
    toast.success('Evening check-in saved!');
  };

  return (
    <AppLayout title="Shift Check-ins">
      <Tabs defaultValue={initialTab} className="animate-fade-in">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="morning" className="gap-1">
            <Sun className="h-3.5 w-3.5" />{hasMorning && <Check className="h-3 w-3" />}Pre-shift
          </TabsTrigger>
          <TabsTrigger value="midday" className="gap-1">
            <Cloud className="h-3.5 w-3.5" />{hasMidday && <Check className="h-3 w-3" />}Mid-shift
          </TabsTrigger>
          <TabsTrigger value="evening" className="gap-1">
            <Moon className="h-3.5 w-3.5" />{hasEvening && <Check className="h-3 w-3" />}Post-shift
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning" className="space-y-4 mt-4">
          {hasMorning ? (
            <div className="text-center py-8 text-muted-foreground">
              <Check className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p>Pre-shift check-in completed.</p>
            </div>
          ) : (
            <>
              <div><Label>Wake-up Time</Label><Input type="time" value={wakeUp} onChange={e => setWakeUp(e.target.value)} /></div>
              <div><Label>Pre-shift meal</Label><Input value={breakfast} onChange={e => setBreakfast(e.target.value)} placeholder="What did you eat before driving?" /><TagSelector tags={breakfastTags} setTags={setBreakfastTags} /></div>
              <div><Label>Sleep quality before shift ({sleepQuality[0]}/10)</Label><Slider value={sleepQuality} onValueChange={setSleepQuality} min={1} max={10} step={1} /></div>
              <div><Label>Fit-to-drive feeling ({morningWellbeing[0]}/10)</Label><Slider value={morningWellbeing} onValueChange={setMorningWellbeing} min={1} max={10} step={1} /></div>
              <Button onClick={saveMorning} className="w-full">Save Pre-shift Check-in</Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="midday" className="space-y-4 mt-4">
          {hasMidday ? (
            <div className="text-center py-8 text-muted-foreground">
              <Check className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p>Mid-shift check-in completed.</p>
            </div>
          ) : (
            <>
              <div><Label>Mid-shift meal / hydration</Label><Input value={lunch} onChange={e => setLunch(e.target.value)} placeholder="Fuel, water, coffee..." /><TagSelector tags={lunchTags} setTags={setLunchTags} /></div>
              <div><Label>Stress and workload ({middayStress[0]}/10)</Label><Slider value={middayStress} onValueChange={setMiddayStress} min={1} max={10} step={1} /></div>
              <Button onClick={saveMidday} className="w-full">Save Mid-shift Check-in</Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="evening" className="space-y-4 mt-4">
          {hasEvening ? (
            <div className="text-center py-8 text-muted-foreground">
              <Check className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p>Post-shift check-in completed.</p>
            </div>
          ) : (
            <>
              <div><Label>Post-shift meal</Label><Input value={dinner} onChange={e => setDinner(e.target.value)} placeholder="How did you recover after shift?" /><TagSelector tags={dinnerTags} setTags={setDinnerTags} /></div>
              <div><Label>End-of-shift stress ({eveningStress[0]}/10)</Label><Slider value={eveningStress} onValueChange={setEveningStress} min={1} max={10} step={1} /></div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label>Steps</Label><Input type="number" value={steps} onChange={e => setSteps(e.target.value)} /></div>
                <div><Label>Exercise (min)</Label><Input type="number" value={exerciseMin} onChange={e => setExerciseMin(e.target.value)} /></div>
                <div><Label>Seat/screen (min)</Label><Input type="number" value={computerMin} onChange={e => setComputerMin(e.target.value)} /></div>
              </div>
              <div><Label>Overall wellbeing ({wellbeing[0]}/10)</Label><Slider value={wellbeing} onValueChange={setWellbeing} min={1} max={10} step={1} /></div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <Label>Any symptoms affecting safe driving today?</Label>
                <Switch checked={hasSymptoms} onCheckedChange={setHasSymptoms} />
              </div>
              {hasSymptoms && <Textarea value={symptomDesc} onChange={e => setSymptomDesc(e.target.value)} placeholder="Briefly describe what you noticed..." />}
              <Button onClick={saveEvening} className="w-full">Save Post-shift Check-in</Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default DailyLog;
