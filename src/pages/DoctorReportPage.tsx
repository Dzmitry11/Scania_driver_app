import { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProfile, getMorningLogs, getMiddayLogs, getEveningLogs, getBPReadings, getHabitLogs, getHeightWeights, getIllnessEpisodes, getCycleEntries } from '@/lib/storage';
import { computeRiskSignals } from '@/lib/riskSignals';
import { translations } from '@/lib/translations';
import type { ReportLanguage } from '@/types/health';
import { FileText, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const DoctorReportPage = () => {
  const [lang, setLang] = useState<ReportLanguage>('en');
  const [period, setPeriod] = useState<'30' | '90'>('30');
  const t = translations[lang];

  const profile = getProfile();
  const morningLogs = getMorningLogs();
  const middayLogs = getMiddayLogs();
  const eveningLogs = getEveningLogs();
  const bpReadings = getBPReadings();
  const habitLogs = getHabitLogs();
  const heightWeights = getHeightWeights();
  const episodes = getIllnessEpisodes();
  const cycles = getCycleEntries();

  const days = Number(period);
  const cutoff = Date.now() - days * 86400000;
  const filterDate = (date: string) => new Date(date).getTime() >= cutoff;

  const filteredMorning = morningLogs.filter(l => filterDate(l.date));
  const filteredEvening = eveningLogs.filter(l => filterDate(l.date));
  const filteredBP = bpReadings.filter(r => filterDate(r.date));
  const filteredHabits = habitLogs.filter(l => filterDate(l.date));
  const filteredHW = heightWeights.filter(hw => filterDate(hw.date));
  const filteredEpisodes = episodes.filter(e => filterDate(e.startDate));

  const riskSignals = useMemo(() =>
    computeRiskSignals(bpReadings, morningLogs, eveningLogs, episodes, heightWeights),
    [bpReadings, morningLogs, eveningLogs, episodes, heightWeights]
  );

  const age = profile?.dateOfBirth
    ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (365.25 * 86400000))
    : null;

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 15;
    const lineH = 6;
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxW = pageW - margin * 2;

    const addLine = (text: string, bold = false, size = 10) => {
      if (y > 270) { doc.addPage(); y = 15; }
      doc.setFontSize(size);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxW);
      doc.text(lines, margin, y);
      y += lines.length * lineH;
    };

    const addSection = (title: string) => {
      y += 4;
      addLine(title, true, 12);
      y += 2;
    };

    // Title
    addLine(t.reportTitle, true, 14);
    y += 2;
    addLine(`${t.generatedOn}: ${new Date().toLocaleDateString()}`, false, 8);
    addLine(`${t.period}: ${days} days`, false, 8);
    y += 2;

    // Disclaimer
    doc.setFontSize(7);
    doc.setTextColor(120);
    const discLines = doc.splitTextToSize(t.disclaimer, maxW);
    doc.text(discLines, margin, y);
    y += discLines.length * 4 + 4;
    doc.setTextColor(0);

    // Patient info
    addSection(t.patientInfo);
    if (profile) {
      addLine(`${t.name}: ${profile.firstName} ${profile.lastName}`);
      addLine(`${t.sex}: ${t[profile.sex]}`);
      addLine(`${t.age}: ${age} ${t.years}`);
      addLine(`${t.bloodGroup}: ${profile.bloodGroup || '-'}`);
      addLine(`${t.allergies}: ${[...profile.allergies, profile.allergyNotes].filter(Boolean).join(', ') || '-'}`);
      addLine(`${t.chronicConditions}: ${[...profile.chronicConditions, profile.chronicConditionNotes].filter(Boolean).join(', ') || '-'}`);
      addLine(`${t.workType}: ${t[profile.workType]} (${t.loadLevel}: ${t[profile.loadLevel]})`);
    }

    // Height/Weight
    addSection(t.heightWeight);
    if (filteredHW.length > 0) {
      filteredHW.forEach(hw => addLine(`${new Date(hw.date).toLocaleDateString()}: ${hw.heightCm} cm / ${hw.weightKg} kg`));
    } else addLine(t.noData);

    // BP
    addSection(t.bloodPressure);
    if (filteredBP.length > 0) {
      filteredBP.forEach(r => addLine(`${new Date(r.date).toLocaleDateString()}: ${r.systolic}/${r.diastolic} mmHg${r.pulse ? ` (${t.pulse}: ${r.pulse})` : ''}${r.context ? ` [${r.context}]` : ''}`));
    } else addLine(t.noData);

    // Lifestyle
    addSection(t.lifestyleTrends);
    if (filteredMorning.length > 0) {
      const avgSleep = filteredMorning.reduce((a, l) => a + l.sleepQuality, 0) / filteredMorning.length;
      addLine(`${t.sleepQuality}: ${avgSleep.toFixed(1)}/10 (avg, ${filteredMorning.length} entries)`);
    }
    if (filteredEvening.length > 0) {
      const avgStress = filteredEvening.reduce((a, l) => a + l.stressLevel, 0) / filteredEvening.length;
      const avgSteps = filteredEvening.reduce((a, l) => a + l.steps, 0) / filteredEvening.length;
      const avgExercise = filteredEvening.reduce((a, l) => a + l.exerciseMinutes, 0) / filteredEvening.length;
      const avgComputer = filteredEvening.reduce((a, l) => a + l.computerMinutes, 0) / filteredEvening.length;
      const avgWellbeing = filteredEvening.reduce((a, l) => a + l.wellbeing, 0) / filteredEvening.length;
      addLine(`${t.stressLevel}: ${avgStress.toFixed(1)}/10 (avg)`);
      addLine(`${t.steps}: ${avgSteps.toFixed(0)} (avg/day)`);
      addLine(`${t.exercise}: ${avgExercise.toFixed(0)} min (avg/day)`);
      addLine(`${t.computerTime}: ${avgComputer.toFixed(0)} min (avg/day)`);
      addLine(`${t.wellbeing}: ${avgWellbeing.toFixed(1)}/10 (avg)`);
    }

    // Habits
    addSection(t.habitsSummary);
    if (filteredHabits.length > 0) {
      const avgA = filteredHabits.reduce((a, l) => a + l.alcoholUnits, 0) / filteredHabits.length;
      const avgC = filteredHabits.reduce((a, l) => a + l.cigarettes, 0) / filteredHabits.length;
      addLine(`${t.alcohol}: ${avgA.toFixed(1)}/day avg`);
      addLine(`${t.cigarettes}: ${avgC.toFixed(1)}/day avg`);
      addLine(`${t.snus}: ${(filteredHabits.reduce((a, l) => a + l.snusPortions, 0) / filteredHabits.length).toFixed(1)}/day avg`);
      addLine(`${t.vape}: ${(filteredHabits.reduce((a, l) => a + l.vapeSessions, 0) / filteredHabits.length).toFixed(1)}/day avg`);
    } else addLine(t.noData);

    // Episodes
    addSection(t.illnessEpisodes);
    if (filteredEpisodes.length > 0) {
      filteredEpisodes.forEach(ep => {
        addLine(`${t.startDate}: ${new Date(ep.startDate).toLocaleDateString()}${ep.endDate ? ` — ${t.endDate}: ${new Date(ep.endDate).toLocaleDateString()}` : ` (${t.active})`}`, true);
        addLine(`${t.symptoms}: ${ep.symptoms.map(s => `${s.name} (${s.severity}/10)`).join(', ') || '-'}`);
        if (ep.temperatures.length) addLine(`${t.temperature}: ${ep.temperatures.map(t2 => `${t2.valueCelsius}°C`).join(', ')}`);
        if (ep.medications.length) addLine(`${t.medications}: ${ep.medications.map(m => `${m.name} @ ${m.time}`).join(', ')}`);
        if (ep.notes) addLine(`${t.notes}: ${ep.notes}`);
        y += 2;
      });
    } else addLine(t.noData);

    // Women's health
    if (profile?.womensHealthEnabled && cycles.length > 0) {
      addSection(t.womensHealth);
      cycles.filter(c => filterDate(c.startDate)).forEach(c => {
        addLine(`${t.cycleStart}: ${new Date(c.startDate).toLocaleDateString()}${c.endDate ? ` — ${t.cycleEnd}: ${new Date(c.endDate).toLocaleDateString()}` : ''}`);
        addLine(`${t.flowIntensity}: ${t[c.flowIntensity]}, ${t.painLevel}: ${c.painLevel}/10`);
        if (c.notes) addLine(`${t.notes}: ${c.notes}`);
      });
    }

    // Risk signals
    addSection(t.riskSignals);
    if (riskSignals.length > 0) {
      riskSignals.forEach(s => {
        addLine(`⚠ ${s.title}`, true);
        addLine(`${t.observedData}: ${s.observedData}`);
        addLine(`${t.nextStep}: ${s.nextStep}`);
        y += 2;
      });
    } else addLine(t.noData);

    // Footer
    y += 6;
    doc.setFontSize(7);
    doc.setTextColor(120);
    const footerLines = doc.splitTextToSize(t.disclaimer, maxW);
    doc.text(footerLines, margin, y);

    doc.save(`medical-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF downloaded!');
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: t.reportTitle, text: t.disclaimer });
      } catch { /* user cancelled */ }
    } else {
      toast.info('Use the download button to save and share the PDF');
    }
  };

  return (
    <AppLayout title="Doctor Report">
      <div className="space-y-4 animate-fade-in">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Select value={lang} onValueChange={v => setLang(v as ReportLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="sv">Svenska</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={period} onValueChange={v => setPeriod(v as '30' | '90')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 {t.date === 'Дата' ? 'дней' : 'days'}</SelectItem>
                  <SelectItem value="90">90 {t.date === 'Дата' ? 'дней' : 'days'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-4">
          <h3 className="font-bold text-sm mb-3">{t.reportTitle}</h3>
          <p className="text-[10px] text-muted-foreground italic mb-3">{t.disclaimer}</p>

          <div className="space-y-3 text-xs">
            <div>
              <p className="font-semibold">{t.patientInfo}</p>
              {profile && (
                <div className="mt-1 space-y-0.5 text-muted-foreground">
                  <p>{t.name}: {profile.firstName} {profile.lastName}</p>
                  <p>{t.sex}: {t[profile.sex]} • {t.age}: {age} {t.years}</p>
                  <p>{t.bloodGroup}: {profile.bloodGroup || '-'}</p>
                </div>
              )}
            </div>

            <div>
              <p className="font-semibold">{t.measurementOverview}</p>
              <p className="text-muted-foreground mt-1">
                {filteredBP.length} BP readings, {filteredMorning.length} morning logs, {filteredEvening.length} evening logs
              </p>
            </div>

            {riskSignals.length > 0 && (
              <div>
                <p className="font-semibold">{t.riskSignals}</p>
                {riskSignals.map(s => (
                  <p key={s.id} className="text-muted-foreground mt-0.5">⚠ {s.title}</p>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={generatePDF} className="gap-2">
            <Download className="h-4 w-4" />PDF
          </Button>
          <Button variant="outline" onClick={shareReport} className="gap-2">
            <Share2 className="h-4 w-4" />Share
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default DoctorReportPage;
