export interface UserProfile {
  firstName: string;
  lastName: string;
  sex: 'male' | 'female' | 'other';
  dateOfBirth: string; // ISO date
  bloodGroup: string;
  allergies: string[];
  allergyNotes: string;
  chronicConditions: string[];
  chronicConditionNotes: string;
  workType: 'sedentary' | 'physical' | 'harmful';
  loadLevel: 'low' | 'medium' | 'high';
  womensHealthEnabled: boolean;
  onboardingComplete: boolean;
}

export interface HeightWeight {
  id: string;
  date: string;
  heightCm: number;
  weightKg: number;
}

export interface MorningLog {
  id: string;
  date: string;
  wakeUpTime: string;
  breakfast: string;
  breakfastTags: string[];
  sleepQuality: number;
  wellbeing?: number;
}

export interface MiddayLog {
  id: string;
  date: string;
  lunch: string;
  lunchTags: string[];
  stressLevel: number;
}

export interface EveningLog {
  id: string;
  date: string;
  dinner: string;
  dinnerTags: string[];
  stressLevel: number;
  steps: number;
  exerciseMinutes: number;
  computerMinutes: number;
  wellbeing: number;
  hasSymptomsToday: boolean;
  symptomDescription?: string;
}

export interface BloodPressureReading {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  context?: string;
}

export interface HabitLog {
  id: string;
  date: string;
  alcoholUnits: number;
  cigarettes: number;
  snusPortions: number;
  vapeSessions: number;
}

export interface SymptomEntry {
  name: string;
  severity: number;
}

export interface TemperatureReading {
  timestamp: string;
  valueCelsius: number;
}

export interface MedicationEntry {
  name: string;
  time: string;
  dose?: string;
}

export interface IllnessEpisode {
  id: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  symptoms: SymptomEntry[];
  temperatures: TemperatureReading[];
  bloodPressures: BloodPressureReading[];
  tests: { name: string; value: string; date: string }[];
  medications: MedicationEntry[];
  notes: string;
}

export interface CycleEntry {
  id: string;
  startDate: string;
  endDate?: string;
  flowIntensity: 'light' | 'medium' | 'heavy';
  painLevel: number;
  notes: string;
}

export interface RiskSignal {
  id: string;
  type: string;
  title: string;
  description: string;
  observedData: string;
  date: string;
  nextStep: string;
  severity: 'info' | 'warning' | 'urgent';
}

export type ReportLanguage = 'en' | 'sv' | 'ru';
