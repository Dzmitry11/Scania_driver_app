import type {
  UserProfile, HeightWeight, MorningLog, MiddayLog, EveningLog,
  BloodPressureReading, HabitLog, IllnessEpisode, CycleEntry
} from '@/types/health';

const KEYS = {
  profile: 'pma_profile',
  heightWeight: 'pma_height_weight',
  morningLogs: 'pma_morning_logs',
  middayLogs: 'pma_midday_logs',
  eveningLogs: 'pma_evening_logs',
  bpReadings: 'pma_bp_readings',
  habitLogs: 'pma_habit_logs',
  illnessEpisodes: 'pma_illness_episodes',
  cycleEntries: 'pma_cycle_entries',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Profile
export const getProfile = (): UserProfile | null => get<UserProfile | null>(KEYS.profile, null);
export const saveProfile = (p: UserProfile) => set(KEYS.profile, p);

// Height/Weight
export const getHeightWeights = (): HeightWeight[] => get<HeightWeight[]>(KEYS.heightWeight, []);
export const saveHeightWeight = (hw: HeightWeight) => {
  const all = getHeightWeights();
  all.push(hw);
  set(KEYS.heightWeight, all);
};

// Daily logs
export const getMorningLogs = (): MorningLog[] => get(KEYS.morningLogs, []);
export const saveMorningLog = (l: MorningLog) => { const a = getMorningLogs(); a.push(l); set(KEYS.morningLogs, a); };

export const getMiddayLogs = (): MiddayLog[] => get(KEYS.middayLogs, []);
export const saveMiddayLog = (l: MiddayLog) => { const a = getMiddayLogs(); a.push(l); set(KEYS.middayLogs, a); };

export const getEveningLogs = (): EveningLog[] => get(KEYS.eveningLogs, []);
export const saveEveningLog = (l: EveningLog) => { const a = getEveningLogs(); a.push(l); set(KEYS.eveningLogs, a); };

// BP
export const getBPReadings = (): BloodPressureReading[] => get(KEYS.bpReadings, []);
export const saveBPReading = (r: BloodPressureReading) => { const a = getBPReadings(); a.push(r); set(KEYS.bpReadings, a); };

// Habits
export const getHabitLogs = (): HabitLog[] => get(KEYS.habitLogs, []);
export const saveHabitLog = (l: HabitLog) => { const a = getHabitLogs(); a.push(l); set(KEYS.habitLogs, a); };

// Illness
export const getIllnessEpisodes = (): IllnessEpisode[] => get(KEYS.illnessEpisodes, []);
export const saveIllnessEpisodes = (eps: IllnessEpisode[]) => set(KEYS.illnessEpisodes, eps);
export const addIllnessEpisode = (e: IllnessEpisode) => { const a = getIllnessEpisodes(); a.push(e); saveIllnessEpisodes(a); };
export const updateIllnessEpisode = (e: IllnessEpisode) => {
  const a = getIllnessEpisodes().map(ep => ep.id === e.id ? e : ep);
  saveIllnessEpisodes(a);
};

// Cycle
export const getCycleEntries = (): CycleEntry[] => get(KEYS.cycleEntries, []);
export const saveCycleEntry = (c: CycleEntry) => { const a = getCycleEntries(); a.push(c); set(KEYS.cycleEntries, a); };
export const updateCycleEntry = (c: CycleEntry) => {
  const a = getCycleEntries().map(e => e.id === c.id ? c : e);
  set(KEYS.cycleEntries, a);
};

// Clear all
export const clearAllData = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
};

// Export all
export const exportAllData = () => {
  const data: Record<string, unknown> = {};
  Object.entries(KEYS).forEach(([name, key]) => {
    data[name] = get(key, null);
  });
  return data;
};
