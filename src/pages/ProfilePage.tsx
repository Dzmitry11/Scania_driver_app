import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { getProfile, saveProfile, getHeightWeights, saveHeightWeight, clearAllData, exportAllData } from '@/lib/storage';
import type { UserProfile } from '@/types/health';
import { toast } from 'sonner';
import { Download, Trash2, Scale } from 'lucide-react';

const ALLERGY_OPTIONS = ['Pollen', 'Dust', 'Nuts', 'Shellfish', 'Dairy', 'Gluten', 'Penicillin', 'Latex'];
const CONDITION_OPTIONS = ['Asthma', 'Diabetes', 'Heart condition', 'Thyroid', 'Epilepsy', 'Arthritis'];

const ProfilePage = () => {
  const existingProfile = getProfile();
  const [profile, setProfile] = useState<UserProfile>(existingProfile || {
    firstName: '', lastName: '', sex: 'male', dateOfBirth: '',
    bloodGroup: '', allergies: [], allergyNotes: '', chronicConditions: [],
    chronicConditionNotes: '', workType: 'sedentary', loadLevel: 'medium',
    womensHealthEnabled: false, onboardingComplete: true,
  });

  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const heightWeights = getHeightWeights();

  const update = (k: keyof UserProfile, v: unknown) => setProfile(p => ({ ...p, [k]: v }));
  const toggleArray = (key: 'allergies' | 'chronicConditions', val: string) => {
    const arr = (profile[key] || []) as string[];
    update(key, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const save = () => {
    saveProfile(profile);
    toast.success('Profile saved!');
  };

  const saveHW = () => {
    if (!heightCm || !weightKg) return;
    saveHeightWeight({ id: crypto.randomUUID(), date: new Date().toISOString(), heightCm: Number(heightCm), weightKg: Number(weightKg) });
    setHeightCm(''); setWeightKg('');
    toast.success('Height & weight updated!');
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `health-data-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported!');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      clearAllData();
      toast.success('All data cleared');
      window.location.reload();
    }
  };

  const age = profile.dateOfBirth
    ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 86400000))
    : null;

  return (
    <AppLayout title="Profile">
      <div className="space-y-4 animate-fade-in">
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Personal Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>First Name</Label><Input value={profile.firstName} onChange={e => update('firstName', e.target.value)} /></div>
            <div><Label>Last Name</Label><Input value={profile.lastName} onChange={e => update('lastName', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Date of Birth{age !== null ? ` (${age} years)` : ''}</Label><Input type="date" value={profile.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} /></div>
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
          </div>
          <div><Label>Blood Group</Label><Input value={profile.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} placeholder="e.g. A+" /></div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Health Background</h3>
          <div>
            <Label>Allergies</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {ALLERGY_OPTIONS.map(a => (
                <button key={a} onClick={() => toggleArray('allergies', a)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    profile.allergies.includes(a) ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'
                  }`}>{a}</button>
              ))}
            </div>
            <Textarea className="mt-2" placeholder="Other allergies..." value={profile.allergyNotes} onChange={e => update('allergyNotes', e.target.value)} />
          </div>
          <div>
            <Label>Chronic Conditions (as reported)</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {CONDITION_OPTIONS.map(c => (
                <button key={c} onClick={() => toggleArray('chronicConditions', c)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    profile.chronicConditions.includes(c) ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'
                  }`}>{c}</button>
              ))}
            </div>
            <Textarea className="mt-2" placeholder="Other conditions..." value={profile.chronicConditionNotes} onChange={e => update('chronicConditionNotes', e.target.value)} />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Work & Preferences</h3>
          <div>
            <Label>Primary Shift Type</Label>
            <Select value={profile.workType} onValueChange={v => update('workType', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Long-haul highway</SelectItem>
                <SelectItem value="physical">Distribution / city driving</SelectItem>
                <SelectItem value="harmful">Heavy-duty / demanding environment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Typical Operational Load</Label>
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
            <Label>Women's Health Tracking</Label>
            <Switch checked={profile.womensHealthEnabled} onCheckedChange={v => update('womensHealthEnabled', v)} />
          </div>
          <Button onClick={save} className="w-full">Save Profile</Button>
        </Card>

        {/* Monthly height/weight */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Monthly Height & Weight</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Height (cm)</Label><Input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} /></div>
            <div><Label>Weight (kg)</Label><Input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} /></div>
          </div>
          <Button onClick={saveHW} className="w-full" variant="outline" disabled={!heightCm || !weightKg}>Update</Button>
          {heightWeights.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              Last: {heightWeights[heightWeights.length - 1].heightCm}cm / {heightWeights[heightWeights.length - 1].weightKg}kg
              ({new Date(heightWeights[heightWeights.length - 1].date).toLocaleDateString()})
            </div>
          )}
        </Card>

        {/* Data management */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Data Management</h3>
          <Button onClick={handleExport} variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />Export All Data
          </Button>
          <Button onClick={handleClear} variant="destructive" className="w-full gap-2">
            <Trash2 className="h-4 w-4" />Delete All Data
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
