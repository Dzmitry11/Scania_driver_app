import type { BloodPressureReading, EveningLog, MorningLog, IllnessEpisode, HeightWeight, RiskSignal } from '@/types/health';

let signalId = 0;
const mkId = () => `rs_${++signalId}_${Date.now()}`;

export function computeRiskSignals(
  bpReadings: BloodPressureReading[],
  morningLogs: MorningLog[],
  eveningLogs: EveningLog[],
  episodes: IllnessEpisode[],
  heightWeights: HeightWeight[],
): RiskSignal[] {
  const signals: RiskSignal[] = [];
  const now = new Date();
  const days30 = 30 * 86400000;

  // BP signals
  const recentBP = bpReadings.filter(r => now.getTime() - new Date(r.date).getTime() < days30);
  recentBP.forEach(r => {
    if (r.systolic >= 180 || r.diastolic >= 120) {
      signals.push({
        id: mkId(), type: 'bp_critical', severity: 'urgent',
        title: 'Very high blood pressure reading recorded',
        description: 'A blood pressure reading significantly above typical ranges was recorded. This is based on self-reported data.',
        observedData: `${r.systolic}/${r.diastolic} mmHg on ${new Date(r.date).toLocaleDateString()}`,
        date: r.date,
        nextStep: 'If you feel unsafe or symptoms are severe, seek urgent medical help or call local emergency services. Otherwise, repeat the measurement and contact a healthcare professional.',
      });
    } else if (r.systolic >= 140 || r.diastolic >= 90) {
      signals.push({
        id: mkId(), type: 'bp_elevated', severity: 'warning',
        title: 'Elevated blood pressure reading recorded',
        description: 'A blood pressure reading above typical ranges was recorded.',
        observedData: `${r.systolic}/${r.diastolic} mmHg on ${new Date(r.date).toLocaleDateString()}`,
        date: r.date,
        nextStep: 'Consider repeating the measurement under resting conditions. If elevated readings persist, consider contacting a healthcare professional.',
      });
    }
  });

  // Repeated elevated BP
  const elevatedCount = recentBP.filter(r => r.systolic >= 140 || r.diastolic >= 90).length;
  if (elevatedCount >= 3) {
    signals.push({
      id: mkId(), type: 'bp_repeated', severity: 'warning',
      title: 'Repeated elevated blood pressure readings',
      description: `${elevatedCount} elevated readings recorded in the last 30 days.`,
      observedData: `${elevatedCount} readings ≥140/90 mmHg`,
      date: now.toISOString(),
      nextStep: 'Consider contacting a healthcare professional to discuss your recorded blood pressure values.',
    });
  }

  // Sleep + stress
  const recent7Morning = morningLogs.filter(l => now.getTime() - new Date(l.date).getTime() < 7 * 86400000);
  const recent7Evening = eveningLogs.filter(l => now.getTime() - new Date(l.date).getTime() < 7 * 86400000);

  const avgSleep = recent7Morning.length > 0 ? recent7Morning.reduce((s, l) => s + l.sleepQuality, 0) / recent7Morning.length : null;
  const avgStress = recent7Evening.length > 0 ? recent7Evening.reduce((s, l) => s + l.stressLevel, 0) / recent7Evening.length : null;

  if (avgSleep !== null && avgSleep <= 4) {
    signals.push({
      id: mkId(), type: 'sleep_low', severity: 'warning',
      title: 'Low sleep quality pattern',
      description: `Average sleep quality over 7 days: ${avgSleep.toFixed(1)}/10`,
      observedData: `${recent7Morning.length} entries, avg ${avgSleep.toFixed(1)}`,
      date: now.toISOString(),
      nextStep: 'Consider reviewing sleep hygiene practices. If sleep issues persist, consider discussing with a healthcare professional.',
    });
  }

  if (avgStress !== null && avgStress >= 8) {
    signals.push({
      id: mkId(), type: 'stress_high', severity: 'warning',
      title: 'Consistently high stress levels reported',
      description: `Average stress level over 7 days: ${avgStress.toFixed(1)}/10`,
      observedData: `${recent7Evening.length} entries, avg ${avgStress.toFixed(1)}`,
      date: now.toISOString(),
      nextStep: 'Consider stress management strategies. If stress is affecting daily life, consider contacting a healthcare professional.',
    });
  }

  if (avgSleep !== null && avgSleep <= 4 && avgStress !== null && avgStress >= 7) {
    signals.push({
      id: mkId(), type: 'sleep_stress_combo', severity: 'warning',
      title: 'Low sleep + high stress pattern',
      description: 'Both low sleep quality and high stress levels have been observed.',
      observedData: `Sleep avg: ${avgSleep.toFixed(1)}, Stress avg: ${avgStress.toFixed(1)}`,
      date: now.toISOString(),
      nextStep: 'This combination may affect wellbeing. Consider contacting a healthcare professional.',
    });
  }

  // Illness episodes - high temp
  episodes.filter(e => e.active).forEach(ep => {
    ep.temperatures.forEach(t => {
      if (t.valueCelsius >= 40) {
        signals.push({
          id: mkId(), type: 'temp_critical', severity: 'urgent',
          title: 'Very high temperature recorded',
          description: 'A temperature reading significantly above typical ranges was recorded during an illness episode.',
          observedData: `${t.valueCelsius}°C at ${new Date(t.timestamp).toLocaleString()}`,
          date: t.timestamp,
          nextStep: 'If you feel unsafe or symptoms are severe, seek urgent medical help or call local emergency services.',
        });
      } else if (t.valueCelsius >= 38.5) {
        signals.push({
          id: mkId(), type: 'temp_elevated', severity: 'warning',
          title: 'High temperature persists',
          description: 'An elevated temperature was recorded.',
          observedData: `${t.valueCelsius}°C at ${new Date(t.timestamp).toLocaleString()}`,
          date: t.timestamp,
          nextStep: 'Monitor temperature. If it persists or worsens, consider contacting a healthcare professional.',
        });
      }
    });

    // Worsening symptoms
    if (ep.symptoms.length > 0) {
      const highSeverity = ep.symptoms.filter(s => s.severity >= 8);
      if (highSeverity.length >= 3) {
        signals.push({
          id: mkId(), type: 'symptom_severity', severity: 'warning',
          title: 'Multiple high-severity symptoms reported',
          description: `${highSeverity.length} symptoms rated ≥8/10 severity.`,
          observedData: highSeverity.map(s => `${s.name}: ${s.severity}/10`).join(', '),
          date: ep.startDate,
          nextStep: 'Consider contacting a healthcare professional to discuss these symptoms.',
        });
      }
    }
  });

  // Weight change
  if (heightWeights.length >= 2) {
    const sorted = [...heightWeights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    const diff = Math.abs(last.weightKg - prev.weightKg);
    if (diff >= 5) {
      signals.push({
        id: mkId(), type: 'weight_change', severity: 'info',
        title: 'Rapid weight change (user-reported)',
        description: `A change of ${diff.toFixed(1)} kg was recorded between measurements.`,
        observedData: `${prev.weightKg} kg (${new Date(prev.date).toLocaleDateString()}) → ${last.weightKg} kg (${new Date(last.date).toLocaleDateString()})`,
        date: last.date,
        nextStep: 'If unintentional, consider contacting a healthcare professional.',
      });
    }
  }

  return signals;
}
