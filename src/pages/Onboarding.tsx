import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { saveProfile, saveHeightWeight } from '@/lib/storage';
import type { UserProfile } from '@/types/health';
import { Heart, Shield } from 'lucide-react';

const ALLERGY_OPTIONS = ['Pollen', 'Dust', 'Nuts', 'Shellfish', 'Dairy', 'Gluten', 'Penicillin', 'Latex'];
const CONDITION_OPTIONS = ['Asthma', 'Diabetes', 'Heart condition', 'Thyroid', 'Epilepsy', 'Arthritis'];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    sex: 'male', workType: 'sedentary', loadLevel: 'medium',
    allergies: [], allergyNotes: '', chronicConditions: [], chronicConditionNotes: '',
    womensHealthEnabled: false, onboardingComplete: false,
  });
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');

  const update = (k: keyof UserProfile, v: unknown) => setProfile(p => ({ ...p, [k]: v }));
  const toggleArray = (key: 'allergies' | 'chronicConditions', val: string) => {
    const arr = (profile[key] || []) as string[];
    update(key, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleFinish = () => {
    const full: UserProfile = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      sex: profile.sex || 'male',
      dateOfBirth: profile.dateOfBirth || '',
      bloodGroup: profile.bloodGroup || '',
      allergies: profile.allergies || [],
      allergyNotes: profile.allergyNotes || '',
      chronicConditions: profile.chronicConditions || [],
      chronicConditionNotes: profile.chronicConditionNotes || '',
      workType: profile.workType || 'sedentary',
      loadLevel: profile.loadLevel || 'medium',
      womensHealthEnabled: profile.womensHealthEnabled || false,
      onboardingComplete: true,
    };
    saveProfile(full);
    if (heightCm && weightKg) {
      saveHeightWeight({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
      });
    }
    navigate('/');
    window.location.reload();
  };

  const steps = [
    // Welcome
    <div key="welcome" className="flex flex-col items-center text-center gap-6 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Heart className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Personal Medical Assistant</h2>
      <p className="text-muted-foreground">Track your health, document symptoms, and generate clinician-ready reports. This app does not diagnose — it helps you record and understand your health data.</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg p-3">
        <Shield className="h-4 w-4 shrink-0" />
        <span>Your data stays on your device. No data is shared without your consent.</span>
      </div>
      <Button onClick={() => setStep(1)} className="w-full">Get Started</Button>
    </div>,

    // Basic info
    <div key="basic" className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Basic Information</h2>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>First Name</Label><Input value={profile.firstName || ''} onChange={e => update('firstName', e.target.value)} /></div>
        <div><Label>Last Name</Label><Input value={profile.lastName || ''} onChange={e => update('lastName', e.target.value)} /></div>
      </div>
      <div><Label>Date of Birth</Label><Input type="date" value={profile.dateOfBirth || ''} onChange={e => update('dateOfBirth', e.target.value)} /></div>
      <div>
        <Label>Sex</Label>
        <Select value={profile.sex} onValueChange={v => update('sex', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Blood Group</Label><Input value={profile.bloodGroup || ''} onChange={e => update('bloodGroup', e.target.value)} placeholder="e.g. A+" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Height (cm)</Label><Input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} /></div>
        <div><Label>Weight (kg)</Label><Input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} /></div>
      </div>
      <Button onClick={() => setStep(2)} className="w-full" disabled={!profile.firstName || !profile.lastName}>Continue</Button>
    </div>,

    // Health background
    <div key="health" className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Health Background</h2>
      <div>
        <Label>Allergies</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {ALLERGY_OPTIONS.map(a => (
            <button key={a} onClick={() => toggleArray('allergies', a)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                (profile.allergies || []).includes(a) ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'
              }`}>{a}</button>
          ))}
        </div>
        <Textarea className="mt-2" placeholder="Other allergies..." value={profile.allergyNotes || ''} onChange={e => update('allergyNotes', e.target.value)} />
      </div>
      <div>
        <Label>Chronic Conditions (as reported)</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {CONDITION_OPTIONS.map(c => (
            <button key={c} onClick={() => toggleArray('chronicConditions', c)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                (profile.chronicConditions || []).includes(c) ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'
              }`}>{c}</button>
          ))}
        </div>
        <Textarea className="mt-2" placeholder="Other conditions..." value={profile.chronicConditionNotes || ''} onChange={e => update('chronicConditionNotes', e.target.value)} />
      </div>
      <Button onClick={() => setStep(3)} className="w-full">Continue</Button>
    </div>,

    // Work & preferences
    <div key="work" className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold">Work & Preferences</h2>
      <div>
        <Label>Work Type</Label>
        <Select value={profile.workType} onValueChange={v => update('workType', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">Sedentary</SelectItem>
            <SelectItem value="physical">Physically Demanding</SelectItem>
            <SelectItem value="harmful">Harmful Exposure</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Load Level</Label>
        <Select value={profile.loadLevel} onValueChange={v => update('loadLevel', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
        <Label>Enable Women's Health Tracking</Label>
        <Switch checked={profile.womensHealthEnabled || false} onCheckedChange={v => update('womensHealthEnabled', v)} />
      </div>
      <Button onClick={handleFinish} className="w-full">Complete Setup</Button>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {step > 0 && (
          <div className="flex gap-1 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        )}
        {steps[step]}
      </div>
    </div>
  );
};

export default Onboarding;
