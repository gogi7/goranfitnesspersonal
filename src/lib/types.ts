export type MealKind = 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
export type FastingPlan = '16:8' | '18:6' | 'OMAD' | '14:10' | 'custom';
export type Impact = 'low' | 'med' | 'high';
export type Pace = 0.5 | 0.75 | 1.0;

export interface UserProfile {
  name: string;
  dob: string;
  age: number;
  sex: 'male' | 'female';
  heightCm: number;
  startWeight: number;
  startDate: string;
  goalWeight: number;
  activityFactor: number;
  activityLabel: string;
  conditions: string[];
  proteinTargetG: number;
  carbTargetG: number;
  fatTargetG: number;
}

export interface WeightEntry {
  date: string;
  kg: number;
}

export interface FoodEntry {
  id: string;
  date: string;
  meal: MealKind;
  time: string;
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
}

export interface FastingSession {
  active: boolean;
  startedAt: string | null;
  plan: FastingPlan;
  goalHours: number;
  history: Array<{
    id: string;
    date: string;
    plan: FastingPlan;
    startedAt: string;
    endedAt: string;
    hours: number;
    completed: boolean;
  }>;
}

export interface ExerciseEntry {
  id: string;
  date: string;
  type: string;
  minutes: number;
  kcal: number;
  impact: Impact;
}

export interface PhotoMeta {
  id: string;
  date: string;
  weightKg: number;
  label?: string;
}

export interface Preferences {
  paceKgPerWeek: Pace;
  fastingPlanDefault: FastingPlan;
  fastingGoalDefaultHours: number;
}

export interface AppState {
  user: UserProfile;
  weightLog: WeightEntry[];
  foodLog: FoodEntry[];
  fasting: FastingSession;
  exerciseLog: ExerciseEntry[];
  photos: PhotoMeta[];
  prefs: Preferences;
}
