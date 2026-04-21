import type { Pace, UserProfile, WeightEntry } from './types';

export const KCAL_PER_KG = 7700;

export function bmr(args: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: 'male' | 'female';
}): number {
  const { weightKg, heightCm, age, sex } = args;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
}

export function tdee(args: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: 'male' | 'female';
  activityFactor: number;
}): number {
  return Math.round(bmr(args) * args.activityFactor);
}

export function bmi(kg: number, cm: number): number {
  const m = cm / 100;
  return kg / (m * m);
}

export function bmiClass(v: number): { label: string; tone: 'ok' | 'warn' | 'bad' } {
  if (v < 18.5) return { label: 'Underweight', tone: 'warn' };
  if (v < 25) return { label: 'Healthy', tone: 'ok' };
  if (v < 30) return { label: 'Overweight', tone: 'warn' };
  return { label: 'Obese', tone: 'bad' };
}

export function projectTimeline(args: {
  startWeight: number;
  goalWeight: number;
  kgPerWeek: number;
  startDate: string;
  currentWeight?: number;
}): { weeks: number; end: Date; weeksRemaining: number } {
  const { startWeight, goalWeight, kgPerWeek, startDate, currentWeight } = args;
  const toLose = Math.max(0, startWeight - goalWeight);
  const weeks = kgPerWeek > 0 ? Math.ceil(toLose / kgPerWeek) : 0;
  const start = new Date(startDate);
  const end = new Date(start.getTime() + weeks * 7 * 86400000);
  const fromNow = currentWeight ?? startWeight;
  const remaining = Math.max(0, fromNow - goalWeight);
  const weeksRemaining = kgPerWeek > 0 ? Math.ceil(remaining / kgPerWeek) : 0;
  return { weeks, end, weeksRemaining };
}

export interface Milestone {
  i: number;
  weightKg: number;
  date: Date;
  label: string;
}

export function buildMilestones(
  startWeight: number,
  goalWeight: number,
  kgPerWeek: number,
  startDate: string
): Milestone[] {
  const delta = startWeight - goalWeight;
  const stepW = delta / 4;
  const start = new Date(startDate);
  const stepWeeks = kgPerWeek > 0 ? stepW / kgPerWeek : 0;
  const labels = [
    'First quarter — clothes start to fit',
    'Halfway — energy + sleep lift',
    'Three quarters — BMI into healthy range',
    'Goal — maintain mode',
  ];
  const items: Milestone[] = [];
  for (let i = 1; i <= 4; i++) {
    const w = +(startWeight - stepW * i).toFixed(1);
    const d = new Date(start.getTime() + i * stepWeeks * 7 * 86400000);
    items.push({ i, weightKg: w, date: d, label: labels[i - 1] });
  }
  return items;
}

export function fmtDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function fmtDateShort(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

export function fmtTime(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
}

export function targetKcalFor(user: UserProfile, weightKg: number, paceKgPerWeek: Pace): number {
  const tdeeVal = tdee({
    weightKg,
    heightCm: user.heightCm,
    age: user.age,
    sex: user.sex,
    activityFactor: user.activityFactor,
  });
  const dailyDeficit = (paceKgPerWeek * KCAL_PER_KG) / 7;
  return Math.round(tdeeVal - dailyDeficit);
}

export function currentWeight(log: WeightEntry[], fallback: number): number {
  if (!log.length) return fallback;
  return log[log.length - 1].kg;
}

export function sortedWeightLog(log: WeightEntry[]): WeightEntry[] {
  return [...log].sort((a, b) => a.date.localeCompare(b.date));
}
