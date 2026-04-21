import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  FastingPlan,
  FoodEntry,
  ExerciseEntry,
  Pace,
  PhotoMeta,
  UserProfile,
  WeightEntry,
} from './types';
import { todayISO, uid, hoursBetween, nowISO } from './dates';

// Seed data — from design/.../src/data.jsx. User can overwrite via log actions.
const SEED_USER: UserProfile = {
  name: 'Goran Babić',
  dob: '1984-11-10',
  age: 41,
  sex: 'male',
  heightCm: 180,
  startWeight: 109.4,
  startDate: '2026-04-01',
  goalWeight: 79.0,
  activityFactor: 1.375,
  activityLabel: 'Lightly active · tennis 1×/wk + desk',
  conditions: ['Prefer low-impact — stone legs', 'No running / soccer'],
  proteinTargetG: 160,
  carbTargetG: 160,
  fatTargetG: 55,
};

const SEED_WEIGHT: WeightEntry[] = [
  { date: '2026-04-01', kg: 109.4 },
  { date: '2026-04-03', kg: 109.1 },
  { date: '2026-04-05', kg: 108.8 },
  { date: '2026-04-07', kg: 108.9 },
  { date: '2026-04-09', kg: 108.5 },
  { date: '2026-04-11', kg: 108.2 },
  { date: '2026-04-13', kg: 108.0 },
  { date: '2026-04-15', kg: 107.8 },
  { date: '2026-04-17', kg: 107.6 },
  { date: '2026-04-19', kg: 107.3 },
  { date: '2026-04-21', kg: 107.0 },
];

const SEED_FOOD: FoodEntry[] = [
  { id: 'f1', date: '2026-04-21', meal: 'Breakfast', time: '08:10', name: 'Greek yogurt + berries + walnuts', kcal: 320, p: 22, c: 28, f: 14 },
  { id: 'f2', date: '2026-04-21', meal: 'Lunch', time: '12:45', name: 'Grilled chicken bowl · quinoa · greens', kcal: 520, p: 48, c: 46, f: 16 },
  { id: 'f3', date: '2026-04-21', meal: 'Snack', time: '15:30', name: 'Apple + almonds (20g)', kcal: 190, p: 5, c: 22, f: 11 },
];

const SEED_EXERCISE: ExerciseEntry[] = [
  { id: 'e1', date: '2026-04-21', type: 'Walk', minutes: 35, kcal: 160, impact: 'low' },
  { id: 'e2', date: '2026-04-19', type: 'Tennis · singles', minutes: 75, kcal: 640, impact: 'med' },
  { id: 'e3', date: '2026-04-18', type: 'Stationary bike', minutes: 30, kcal: 280, impact: 'low' },
  { id: 'e4', date: '2026-04-16', type: 'Swim · freestyle', minutes: 40, kcal: 380, impact: 'low' },
  { id: 'e5', date: '2026-04-14', type: 'Walk', minutes: 45, kcal: 210, impact: 'low' },
];

export const INITIAL_STATE: AppState = {
  user: SEED_USER,
  weightLog: SEED_WEIGHT,
  foodLog: SEED_FOOD,
  fasting: {
    active: false,
    startedAt: null,
    plan: '16:8',
    goalHours: 16,
    history: [],
  },
  exerciseLog: SEED_EXERCISE,
  photos: [],
  prefs: {
    paceKgPerWeek: 1.0,
    fastingPlanDefault: '16:8',
    fastingGoalDefaultHours: 16,
  },
};

interface Actions {
  logWeight: (kg: number, date?: string) => void;
  deleteWeight: (date: string) => void;
  addFood: (entry: Omit<FoodEntry, 'id'>) => void;
  deleteFood: (id: string) => void;
  startFast: (plan: FastingPlan, goalHours: number, startedAt?: string) => void;
  endFast: () => void;
  setFastingPlan: (plan: FastingPlan, goalHours: number) => void;
  addExercise: (entry: Omit<ExerciseEntry, 'id'>) => void;
  deleteExercise: (id: string) => void;
  setPace: (p: Pace) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  addPhotoMeta: (meta: Omit<PhotoMeta, 'id'>) => string;
  deletePhotoMeta: (id: string) => void;
  exportJSON: () => string;
  importJSON: (json: string) => { ok: boolean; error?: string };
  reset: () => void;
}

export const useStore = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      logWeight: (kg, date) =>
        set((s) => {
          const d = date ?? todayISO();
          const filtered = s.weightLog.filter((w) => w.date !== d);
          const next = [...filtered, { date: d, kg }].sort((a, b) =>
            a.date.localeCompare(b.date)
          );
          return { weightLog: next };
        }),

      deleteWeight: (date) =>
        set((s) => ({ weightLog: s.weightLog.filter((w) => w.date !== date) })),

      addFood: (entry) =>
        set((s) => ({ foodLog: [...s.foodLog, { ...entry, id: uid() }] })),

      deleteFood: (id) =>
        set((s) => ({ foodLog: s.foodLog.filter((f) => f.id !== id) })),

      startFast: (plan, goalHours, startedAt) =>
        set((s) => ({
          fasting: {
            ...s.fasting,
            active: true,
            plan,
            goalHours,
            startedAt: startedAt ?? nowISO(),
          },
        })),

      endFast: () =>
        set((s) => {
          const { fasting } = s;
          if (!fasting.active || !fasting.startedAt) return s;
          const hours = hoursBetween(fasting.startedAt, new Date());
          const endedAt = new Date().toISOString();
          const completed = hours >= fasting.goalHours;
          const entry = {
            id: uid(),
            date: fasting.startedAt.slice(0, 10),
            plan: fasting.plan,
            startedAt: fasting.startedAt,
            endedAt,
            hours: +hours.toFixed(2),
            completed,
          };
          return {
            fasting: {
              ...fasting,
              active: false,
              startedAt: null,
              history: [entry, ...fasting.history].slice(0, 365),
            },
          };
        }),

      setFastingPlan: (plan, goalHours) =>
        set((s) => ({ fasting: { ...s.fasting, plan, goalHours } })),

      addExercise: (entry) =>
        set((s) => ({ exerciseLog: [{ ...entry, id: uid() }, ...s.exerciseLog] })),

      deleteExercise: (id) =>
        set((s) => ({ exerciseLog: s.exerciseLog.filter((e) => e.id !== id) })),

      setPace: (p) => set((s) => ({ prefs: { ...s.prefs, paceKgPerWeek: p } })),

      updateUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),

      addPhotoMeta: (meta) => {
        const id = uid();
        set((s) => ({
          photos: [...s.photos, { ...meta, id }].sort((a, b) =>
            a.date.localeCompare(b.date)
          ),
        }));
        return id;
      },

      deletePhotoMeta: (id) =>
        set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),

      exportJSON: () => {
        const s = get();
        const payload: AppState = {
          user: s.user,
          weightLog: s.weightLog,
          foodLog: s.foodLog,
          fasting: s.fasting,
          exerciseLog: s.exerciseLog,
          photos: s.photos,
          prefs: s.prefs,
        };
        return JSON.stringify(payload, null, 2);
      },

      importJSON: (json) => {
        try {
          const data = JSON.parse(json) as AppState;
          if (!data.user || !Array.isArray(data.weightLog)) {
            return { ok: false, error: 'Missing required fields' };
          }
          set(() => ({
            user: data.user,
            weightLog: data.weightLog,
            foodLog: data.foodLog ?? [],
            fasting: data.fasting ?? INITIAL_STATE.fasting,
            exerciseLog: data.exerciseLog ?? [],
            photos: data.photos ?? [],
            prefs: data.prefs ?? INITIAL_STATE.prefs,
          }));
          return { ok: true };
        } catch (e) {
          return { ok: false, error: (e as Error).message };
        }
      },

      reset: () => set(() => ({ ...INITIAL_STATE })),
    }),
    {
      name: 'pulse:v1',
      version: 1,
    }
  )
);
