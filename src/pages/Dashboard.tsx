import { useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { getProfile, getMorningLogs, getMiddayLogs, getEveningLogs, getBPReadings, getHabitLogs, getIllnessEpisodes, getHeightWeights } from '@/lib/storage';
import { computeRiskSignals } from '@/lib/riskSignals';
import { useNavigate } from 'react-router-dom';
import { Sun, Cloud, Moon, Activity, AlertTriangle, Heart, ClipboardList, Thermometer } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const navigate = useNavigate();
  const profile = getProfile();
  const today = new Date().toISOString().split('T')[0];

  const morningLogs = getMorningLogs();
  const middayLogs = getMiddayLogs();
  const eveningLogs = getEveningLogs();
  const bpReadings = getBPReadings();
  const episodes = getIllnessEpisodes();

  const todayMorning = morningLogs.find(l => l.date === today);
  const todayMidday = middayLogs.find(l => l.date === today);
  const todayEvening = eveningLogs.find(l => l.date === today);

  const activeEpisodes = episodes.filter(e => e.active);

  const riskSignals = useMemo(() =>
    computeRiskSignals(bpReadings, morningLogs, eveningLogs, episodes, getHeightWeights()),
    [bpReadings, morningLogs, eveningLogs, episodes]
  );
  const urgentSignals = riskSignals.filter(s => s.severity === 'urgent');

  const age = profile?.dateOfBirth
    ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 86400000))
    : null;

  const checkinsDone = [todayMorning, todayMidday, todayEvening].filter(Boolean).length;

  return (
    <AppLayout title="Driver Companion">
      <div className="space-y-4 animate-fade-in">
        {/* Greeting */}
        <div className="bg-primary/5 rounded-xl p-4">
          <h2 className="text-xl font-bold text-foreground">
            Hello, {profile?.firstName || 'there'}!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Scania / TRATON Driver Wellbeing & Safety Companion
          </p>
          {age && <p className="text-xs text-muted-foreground mt-1">{age} years old • {profile?.bloodGroup || 'Blood group not set'}</p>}
        </div>

        {/* Urgent alerts */}
        {urgentSignals.length > 0 && (
          <Card className="border-destructive bg-destructive/5 p-4" onClick={() => navigate('/trends')}>
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertTriangle className="h-4 w-4" />
              {urgentSignals.length} conservative safety flag{urgentSignals.length > 1 ? 's' : ''} detected
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tap to review and decide next safe step</p>
          </Card>
        )}

        {/* Active illness */}
        {activeEpisodes.length > 0 && (
          <Card className="border-risk bg-risk-bg p-4 cursor-pointer" onClick={() => navigate('/illness')}>
            <div className="flex items-center gap-2 text-risk-foreground font-semibold text-sm">
              <Thermometer className="h-4 w-4" />
              {activeEpisodes.length} active illness episode{activeEpisodes.length > 1 ? 's' : ''}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tap to update</p>
          </Card>
        )}

        {/* Today's check-ins */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">TODAY'S SHIFT CHECK-INS ({checkinsDone}/3)</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Sun, label: 'Pre-shift', done: !!todayMorning, path: '/log?tab=morning' },
              { icon: Cloud, label: 'Mid-shift', done: !!todayMidday, path: '/log?tab=midday' },
              { icon: Moon, label: 'Post-shift', done: !!todayEvening, path: '/log?tab=evening' },
            ].map(({ icon: Icon, label, done, path }) => (
              <Card key={label}
                className={`p-3 text-center cursor-pointer transition-colors ${done ? 'bg-primary/5 border-primary/30' : 'bg-card'}`}
                onClick={() => navigate(path)}
              >
                <Icon className={`h-5 w-5 mx-auto mb-1 ${done ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-xs font-medium">{label}</span>
                {done && <span className="block text-[10px] text-primary">✓ Done</span>}
              </Card>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">DRIVER TOOLS</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Activity, label: 'Weekly Vitals', path: '/vitals' },
              { icon: ClipboardList, label: 'Lifestyle Habits', path: '/habits' },
              { icon: Thermometer, label: 'Illness Documentation', path: '/illness' },
              { icon: Heart, label: "Women's Health", path: '/womens-health', show: profile?.womensHealthEnabled },
            ]
              .filter(a => a.show !== false)
              .map(({ icon: Icon, label, path }) => (
                <Card key={label} className="p-3 flex items-center gap-3 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => navigate(path)}>
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{label}</span>
                </Card>
              ))}
          </div>
        </div>

        {/* Risk signals summary */}
        {riskSignals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">SAFETY FLAGS ({riskSignals.length})</h3>
            <div className="space-y-2">
              {riskSignals.slice(0, 3).map(s => (
                <Card key={s.id} className={`p-3 ${s.severity === 'urgent' ? 'border-destructive bg-destructive/5' : s.severity === 'warning' ? 'border-risk bg-risk-bg' : 'bg-secondary/50'}`}>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.observedData}</p>
                </Card>
              ))}
              {riskSignals.length > 3 && (
                <button onClick={() => navigate('/trends')} className="text-xs text-primary font-medium">
                  View all {riskSignals.length} signals →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recent stats */}
        {eveningLogs.length > 0 && (() => {
          const last = eveningLogs[eveningLogs.length - 1];
          return (
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">LATEST POST-SHIFT CHECK-IN</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">{last.steps.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Steps</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{last.exerciseMinutes}</p>
                  <p className="text-xs text-muted-foreground">Exercise min</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{last.wellbeing}/10</p>
                  <p className="text-xs text-muted-foreground">Wellbeing</p>
                </div>
              </div>
            </Card>
          );
        })()}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
