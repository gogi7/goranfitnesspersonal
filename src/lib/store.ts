import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  FastingPlan,
  FoodEntry,
  ExerciseEntry,
  Pace,
  PhotoMeta,
  ThemeMode,
  UserProfile,
} from './types';
import { todayISO, uid, hoursBetween, nowISO } from './dates';

// Fresh-start seed: user hasn't logged anything yet. Profile keeps
// sensible defaults that can be edited in Settings. The first weight
// log automatically becomes the baseline (see logWeight action).
function makeInitialState(): AppState {
  const today = todayISO();
  const baseUser: UserProfile = {
    name: 'Goran Babić',
    dob: '1984-11-10',
    age: 41,
    sex: 'male',
    heightCm: 180,
    startWeight: 0,
    startDate: today,
    goalWeight: 79.0,
    activityFactor: 1.375,
    activityLabel: 'Lightly active · tennis 1×/wk + desk',
    conditions: ['Prefer low-impact — stone legs', 'No running / soccer'],
    proteinTargetG: 160,
    carbTargetG: 160,
    fatTargetG: 55,
  };
  return {
    user: baseUser,
    weightLog: [],
    foodLog: [],
    fasting: {
      active: false,
      startedAt: null,
      plan: '16:8',
      goalHours: 16,
      history: [],
    },
    exerciseLog: [],
    photos: [],
    prefs: {
      paceKgPerWeek: 1.0,
      fastingPlanDefault: '16:8',
      fastingGoalDefaultHours: 16,
      theme: 'system',
    },
  };
}

export const INITIAL_STATE: AppState = makeInitialState();

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
  setTheme: (theme: ThemeMode) => void;
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
          // First weight entry establishes the baseline. Also catches
          // the case where the user edited profile but never logged.
          const firstEntry = s.weightLog.length === 0;
          const userNeedsBaseline = s.user.startWeight <= 0;
          if (firstEntry || userNeedsBaseline) {
            return {
              weightLog: next,
              user: {
                ...s.user,
                startWeight: kg,
                startDate: d,
              },
            };
          }
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

      setTheme: (theme) => set((s) => ({ prefs: { ...s.prefs, theme } })),

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

      reset: () => set(() => ({ ...makeInitialState() })),
    }),
    {
      name: 'pulse:v1',
      version: 2,
      migrate: (persisted, version) => {
        // v1 -> v2: wipe the demo seed (user hasn't actually started yet)
        // and add theme preference. Keeps profile edits though.
        if (version < 2) {
          const fresh = makeInitialState();
          const prev = persisted as Partial<AppState> | undefined;
          return {
            ...fresh,
            user: prev?.user
              ? { ...fresh.user, ...prev.user, startWeight: 0, startDate: fresh.user.startDate }
              : fresh.user,
          };
        }
        return persisted as AppState;
      },
    }
  )
);
