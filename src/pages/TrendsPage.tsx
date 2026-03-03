import { useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { getMorningLogs, getEveningLogs, getBPReadings, getHabitLogs, getHeightWeights, getIllnessEpisodes } from '@/lib/storage';
import { computeRiskSignals } from '@/lib/riskSignals';
import { AlertTriangle, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TrendsPage = () => {
  const morningLogs = getMorningLogs();
  const eveningLogs = getEveningLogs();
  const bpReadings = getBPReadings();
  const habitLogs = getHabitLogs();
  const heightWeights = getHeightWeights();
  const episodes = getIllnessEpisodes();

  const riskSignals = useMemo(() =>
    computeRiskSignals(bpReadings, morningLogs, eveningLogs, episodes, heightWeights),
    [bpReadings, morningLogs, eveningLogs, episodes, heightWeights]
  );

  // Chart data
  const sleepData = morningLogs.slice(-14).map(l => ({
    date: new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: l.sleepQuality,
  }));

  const stressData = eveningLogs.slice(-14).map(l => ({
    date: new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: l.stressLevel,
  }));

  const stepsData = eveningLogs.slice(-14).map(l => ({
    date: new Date(l.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: l.steps,
  }));

  const bpData = bpReadings.slice(-10).map(r => ({
    date: new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    systolic: r.systolic,
    diastolic: r.diastolic,
  }));

  const weightData = heightWeights.map(hw => ({
    date: new Date(hw.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: hw.weightKg,
  }));

  const MiniChart = ({ data, dataKey = 'value', color = 'hsl(174, 62%, 38%)' }: { data: { date: string; [k: string]: unknown }[]; dataKey?: string; color?: string }) => (
    data.length > 1 ? (
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 90%)" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} width={30} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    ) : <p className="text-xs text-muted-foreground py-4 text-center">Need more data points</p>
  );

  // Trend helpers
  const trendIcon = (data: number[]) => {
    if (data.length < 2) return <Minus className="h-4 w-4 text-muted-foreground" />;
    const recent = data.slice(-3);
    const older = data.slice(-6, -3);
    if (older.length === 0) return <Minus className="h-4 w-4 text-muted-foreground" />;
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const avgOlder = older.reduce((a, b) => a + b, 0) / older.length;
    if (avgRecent > avgOlder * 1.1) return <TrendingUp className="h-4 w-4 text-primary" />;
    if (avgRecent < avgOlder * 0.9) return <TrendingDown className="h-4 w-4 text-risk" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <AppLayout title="Trends & Insights">
      <div className="space-y-4 animate-fade-in">
        {/* Risk signals */}
        {riskSignals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">RISK SIGNALS</h3>
            {riskSignals.map(s => (
              <Card key={s.id} className={`p-4 mb-2 ${s.severity === 'urgent' ? 'border-destructive bg-destructive/5' : s.severity === 'warning' ? 'border-risk bg-risk-bg' : 'bg-secondary/50'}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${s.severity === 'urgent' ? 'text-destructive' : 'text-risk'}`} />
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                    <p className="text-xs mt-1"><strong>Observed:</strong> {s.observedData}</p>
                    <p className="text-xs mt-1 text-primary"><strong>Next step:</strong> {s.nextStep}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Trend summaries */}
        {morningLogs.length >= 7 && (() => {
          const last7 = morningLogs.slice(-7);
          const prev7 = morningLogs.slice(-14, -7);
          const avgRecent = last7.reduce((a, l) => a + l.sleepQuality, 0) / last7.length;
          const avgPrev = prev7.length > 0 ? prev7.reduce((a, l) => a + l.sleepQuality, 0) / prev7.length : null;
          return avgPrev !== null ? (
            <Card className="p-3 text-sm">
              <p>Average sleep quality {avgRecent > avgPrev ? 'increased' : 'decreased'} from {avgPrev.toFixed(1)} to {avgRecent.toFixed(1)} over 14 days.</p>
            </Card>
          ) : null;
        })()}

        {eveningLogs.length >= 7 && (() => {
          const last7 = eveningLogs.slice(-7);
          const highStressDays = last7.filter(l => l.stressLevel >= 8).length;
          return highStressDays >= 5 ? (
            <Card className="p-3 text-sm border-risk bg-risk-bg">
              <p>Stress level has been consistently high (≥8) for {highStressDays} of the last 7 days.</p>
            </Card>
          ) : null;
        })()}

        {/* Charts */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            SLEEP QUALITY {trendIcon(morningLogs.map(l => l.sleepQuality))}
          </h3>
          <Card className="p-3"><MiniChart data={sleepData} /></Card>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            STRESS LEVEL {trendIcon(eveningLogs.map(l => l.stressLevel))}
          </h3>
          <Card className="p-3"><MiniChart data={stressData} color="hsl(38, 92%, 50%)" /></Card>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            DAILY STEPS {trendIcon(eveningLogs.map(l => l.steps))}
          </h3>
          <Card className="p-3"><MiniChart data={stepsData} color="hsl(152, 60%, 40%)" /></Card>
        </div>

        {bpData.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">BLOOD PRESSURE</h3>
            <Card className="p-3">
              {bpData.length > 1 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={bpData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 15%, 90%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} width={30} />
                    <Tooltip />
                    <Line type="monotone" dataKey="systolic" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="diastolic" stroke="hsl(200, 80%, 50%)" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <p className="text-xs text-muted-foreground py-4 text-center">Need more data points</p>}
            </Card>
          </div>
        )}

        {weightData.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">WEIGHT TREND</h3>
            <Card className="p-3"><MiniChart data={weightData} color="hsl(270, 50%, 50%)" /></Card>
          </div>
        )}

        {habitLogs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">HABITS (LAST 7 DAYS)</h3>
            <Card className="p-3">
              {(() => {
                const last7 = habitLogs.slice(-7);
                const avgAlcohol = last7.reduce((a, l) => a + l.alcoholUnits, 0) / last7.length;
                const totalCigs = last7.reduce((a, l) => a + l.cigarettes, 0);
                return (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>Avg alcohol: {avgAlcohol.toFixed(1)} units/day</div>
                    <div>Total cigarettes: {totalCigs}</div>
                    <div>Total snus: {last7.reduce((a, l) => a + l.snusPortions, 0)}</div>
                    <div>Total vape: {last7.reduce((a, l) => a + l.vapeSessions, 0)}</div>
                  </div>
                );
              })()}
            </Card>
          </div>
        )}

        {riskSignals.length === 0 && morningLogs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Start logging data to see trends and insights here.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TrendsPage;
