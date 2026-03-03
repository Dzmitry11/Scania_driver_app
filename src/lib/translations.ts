import type { ReportLanguage } from '@/types/health';

type TranslationKeys =
  | 'reportTitle' | 'disclaimer' | 'patientInfo' | 'name' | 'sex' | 'age' | 'bloodGroup'
  | 'allergies' | 'chronicConditions' | 'workType' | 'loadLevel'
  | 'measurementOverview' | 'heightWeight' | 'bloodPressure' | 'lifestyleTrends'
  | 'sleepQuality' | 'stressLevel' | 'steps' | 'exercise' | 'computerTime' | 'wellbeing'
  | 'habitsSummary' | 'alcohol' | 'cigarettes' | 'snus' | 'vape'
  | 'illnessEpisodes' | 'symptoms' | 'temperature' | 'medications' | 'notes'
  | 'riskSignals' | 'generatedOn' | 'period' | 'noData' | 'severity'
  | 'startDate' | 'endDate' | 'active' | 'tests' | 'pulse' | 'context'
  | 'date' | 'height' | 'weight' | 'systolic' | 'diastolic'
  | 'male' | 'female' | 'other' | 'sedentary' | 'physical' | 'harmful'
  | 'low' | 'medium' | 'high' | 'light' | 'heavy'
  | 'womensHealth' | 'cycleStart' | 'cycleEnd' | 'flowIntensity' | 'painLevel'
  | 'observedData' | 'nextStep' | 'years';

export const translations: Record<ReportLanguage, Record<TranslationKeys, string>> = {
  en: {
    reportTitle: 'Personal Medical Assistant – Clinician Report',
    disclaimer: 'This report is generated from self-reported data. It does not constitute medical advice, diagnosis, or treatment. It is intended for documentation and informational purposes only.',
    patientInfo: 'Patient Information',
    name: 'Name', sex: 'Sex', age: 'Age', bloodGroup: 'Blood Group',
    allergies: 'Allergies', chronicConditions: 'Chronic Conditions (as reported)',
    workType: 'Work Type', loadLevel: 'Load Level',
    measurementOverview: 'Measurement & Lifestyle Overview',
    heightWeight: 'Height / Weight History', bloodPressure: 'Blood Pressure History',
    lifestyleTrends: 'Lifestyle Trends',
    sleepQuality: 'Sleep Quality', stressLevel: 'Stress Level', steps: 'Steps',
    exercise: 'Exercise (min)', computerTime: 'Computer Time (min)', wellbeing: 'Wellbeing',
    habitsSummary: 'Habits Summary', alcohol: 'Alcohol (units)', cigarettes: 'Cigarettes',
    snus: 'Snus (portions)', vape: 'Vape (sessions)',
    illnessEpisodes: 'Symptom & Illness Episodes',
    symptoms: 'Reported Symptoms', temperature: 'Temperature', medications: 'Medications Taken',
    notes: 'Notes', riskSignals: 'Risk Signals Summary (Non-Diagnostic)',
    generatedOn: 'Generated on', period: 'Period', noData: 'No data available',
    severity: 'Severity', startDate: 'Start Date', endDate: 'End Date', active: 'Active',
    tests: 'Tests/Labs', pulse: 'Pulse', context: 'Context',
    date: 'Date', height: 'Height (cm)', weight: 'Weight (kg)',
    systolic: 'Systolic', diastolic: 'Diastolic',
    male: 'Male', female: 'Female', other: 'Other',
    sedentary: 'Sedentary', physical: 'Physically demanding', harmful: 'Harmful exposure',
    low: 'Low', medium: 'Medium', high: 'High', light: 'Light', heavy: 'Heavy',
    womensHealth: "Women's Health", cycleStart: 'Cycle Start', cycleEnd: 'Cycle End',
    flowIntensity: 'Flow Intensity', painLevel: 'Pain Level',
    observedData: 'Observed Data', nextStep: 'Recommended Next Step', years: 'years',
  },
  sv: {
    reportTitle: 'Personlig Medicinsk Assistent – Klinikrapport',
    disclaimer: 'Denna rapport är baserad på självrapporterade data. Den utgör inte medicinsk rådgivning, diagnos eller behandling. Den är avsedd enbart för dokumentation och informationsändamål.',
    patientInfo: 'Patientinformation',
    name: 'Namn', sex: 'Kön', age: 'Ålder', bloodGroup: 'Blodgrupp',
    allergies: 'Allergier', chronicConditions: 'Kroniska tillstånd (som rapporterat)',
    workType: 'Arbetstyp', loadLevel: 'Belastningsnivå',
    measurementOverview: 'Mätningar & Livsstilsöversikt',
    heightWeight: 'Längd / Vikt Historik', bloodPressure: 'Blodtryckshistorik',
    lifestyleTrends: 'Livsstilstrender',
    sleepQuality: 'Sömnkvalitet', stressLevel: 'Stressnivå', steps: 'Steg',
    exercise: 'Träning (min)', computerTime: 'Datortid (min)', wellbeing: 'Välmående',
    habitsSummary: 'Vanor Sammanfattning', alcohol: 'Alkohol (enheter)', cigarettes: 'Cigaretter',
    snus: 'Snus (portioner)', vape: 'Vape (sessioner)',
    illnessEpisodes: 'Symptom & Sjukdomsepisoder',
    symptoms: 'Rapporterade symptom', temperature: 'Temperatur', medications: 'Tagna mediciner',
    notes: 'Anteckningar', riskSignals: 'Risksignaler Sammanfattning (Icke-diagnostisk)',
    generatedOn: 'Genererad den', period: 'Period', noData: 'Inga data tillgängliga',
    severity: 'Svårighetsgrad', startDate: 'Startdatum', endDate: 'Slutdatum', active: 'Aktiv',
    tests: 'Tester/Labb', pulse: 'Puls', context: 'Kontext',
    date: 'Datum', height: 'Längd (cm)', weight: 'Vikt (kg)',
    systolic: 'Systoliskt', diastolic: 'Diastoliskt',
    male: 'Man', female: 'Kvinna', other: 'Annat',
    sedentary: 'Stillasittande', physical: 'Fysiskt krävande', harmful: 'Skadlig exponering',
    low: 'Låg', medium: 'Medel', high: 'Hög', light: 'Lätt', heavy: 'Kraftig',
    womensHealth: 'Kvinnohälsa', cycleStart: 'Cykelstart', cycleEnd: 'Cykelslut',
    flowIntensity: 'Flödesintensitet', painLevel: 'Smärtnivå',
    observedData: 'Observerade data', nextStep: 'Rekommenderat nästa steg', years: 'år',
  },
  ru: {
    reportTitle: 'Персональный Медицинский Ассистент – Отчёт для врача',
    disclaimer: 'Этот отчёт создан на основе данных, введённых пользователем. Он не является медицинской консультацией, диагнозом или лечением. Предназначен исключительно для документации и информационных целей.',
    patientInfo: 'Информация о пациенте',
    name: 'Имя', sex: 'Пол', age: 'Возраст', bloodGroup: 'Группа крови',
    allergies: 'Аллергии', chronicConditions: 'Хронические состояния (со слов пациента)',
    workType: 'Тип работы', loadLevel: 'Уровень нагрузки',
    measurementOverview: 'Обзор измерений и образа жизни',
    heightWeight: 'История роста / веса', bloodPressure: 'История артериального давления',
    lifestyleTrends: 'Тенденции образа жизни',
    sleepQuality: 'Качество сна', stressLevel: 'Уровень стресса', steps: 'Шаги',
    exercise: 'Тренировки (мин)', computerTime: 'Время за компьютером (мин)', wellbeing: 'Самочувствие',
    habitsSummary: 'Сводка привычек', alcohol: 'Алкоголь (ед.)', cigarettes: 'Сигареты',
    snus: 'Снюс (порции)', vape: 'Вейп (сеансы)',
    illnessEpisodes: 'Эпизоды симптомов и заболеваний',
    symptoms: 'Зарегистрированные симптомы', temperature: 'Температура', medications: 'Принятые лекарства',
    notes: 'Заметки', riskSignals: 'Сводка рисковых сигналов (без диагноза)',
    generatedOn: 'Создан', period: 'Период', noData: 'Нет данных',
    severity: 'Тяжесть', startDate: 'Дата начала', endDate: 'Дата окончания', active: 'Активен',
    tests: 'Анализы/Лаборатория', pulse: 'Пульс', context: 'Контекст',
    date: 'Дата', height: 'Рост (см)', weight: 'Вес (кг)',
    systolic: 'Систолическое', diastolic: 'Диастолическое',
    male: 'Мужской', female: 'Женский', other: 'Другой',
    sedentary: 'Сидячая', physical: 'Физически тяжёлая', harmful: 'Вредное воздействие',
    low: 'Низкий', medium: 'Средний', high: 'Высокий', light: 'Лёгкий', heavy: 'Обильный',
    womensHealth: 'Женское здоровье', cycleStart: 'Начало цикла', cycleEnd: 'Конец цикла',
    flowIntensity: 'Интенсивность', painLevel: 'Уровень боли',
    observedData: 'Наблюдаемые данные', nextStep: 'Рекомендуемый следующий шаг', years: 'лет',
  },
};
