// Goran's seed data + health math helpers
// Personal use, Apr 21 2026

const USER = {
  name: 'Goran Babić',
  dob: '1984-11-10',
  age: 41,
  sex: 'male',
  heightCm: 180,
  startWeight: 109.4,     // true baseline — 1 Apr 2026, when tracking began
  startDate: '2026-04-01',
  currentWeight: 107.0,   // latest logged weight (21 Apr 2026)
  goalWeight: 79.0,
  activityFactor: 1.375,  // lightly active
  activityLabel: 'Lightly active · tennis 1×/wk + desk',
  conditions: ['Prefer low-impact — stone legs', 'No running / soccer'],
};

// Mifflin–St Jeor
function bmr({ weightKg, heightCm, age, sex }) {
  return 10 * weightKg + 6.25 * heightCm + -5 * age + (sex === 'male' ? 5 : -161);
}
function tdee({ weightKg, heightCm, age, sex, activityFactor }) {
  return Math.round(bmr({ weightKg, heightCm, age, sex }) * activityFactor);
}
// 1 kg fat ≈ 7700 kcal
const KCAL_PER_KG = 7700;

// Weight log — 21 Apr 2026 is "today"; seed ~3 weeks of history (leading up to now)
// starting from 109.4 → 107.0 to show a real downtrend.
const WEIGHT_LOG = [
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

// Food log — today
const FOOD_TODAY = [
  { id:'f1', meal:'Breakfast', time:'8:10', name:'Greek yogurt + berries + walnuts', kcal: 320, p: 22, c: 28, f: 14 },
  { id:'f2', meal:'Lunch',     time:'12:45', name:'Grilled chicken bowl · quinoa · greens', kcal: 520, p: 48, c: 46, f: 16 },
  { id:'f3', meal:'Snack',     time:'15:30', name:'Apple + almonds (20g)', kcal: 190, p: 5, c: 22, f: 11 },
];

const FASTING = {
  active: true,
  startedAt: '2026-04-20T20:15',  // started last night
  plan: '16:8',
  goalHours: 16,
};

const EXERCISE_LOG = [
  { id:'e1', date:'2026-04-21', type:'Walk', minutes: 35, kcal: 160, impact:'low' },
  { id:'e2', date:'2026-04-19', type:'Tennis · singles', minutes: 75, kcal: 640, impact:'med' },
  { id:'e3', date:'2026-04-18', type:'Stationary bike', minutes: 30, kcal: 280, impact:'low' },
  { id:'e4', date:'2026-04-16', type:'Swim · freestyle', minutes: 40, kcal: 380, impact:'low' },
  { id:'e5', date:'2026-04-14', type:'Walk', minutes: 45, kcal: 210, impact:'low' },
];

// Progress photos — placeholders; user uploads later.
const PHOTOS = [
  { id:'p1', date:'2026-04-01', weight: 109.4, label:'Day 1 baseline' },
  { id:'p2', date:'2026-04-21', weight: 107.0, label:'Week 3' },
];

// ---- Projection helpers -----------------------------------------------------
function projectTimeline({ startWeight, goalWeight, kgPerWeek, startDate }) {
  const toLose = startWeight - goalWeight;
  const weeks = Math.ceil(toLose / kgPerWeek);
  const start = new Date(startDate);
  const end = new Date(start.getTime() + weeks * 7 * 86400000);
  return { weeks, end };
}
function fmtDate(d) {
  if (typeof d === 'string') d = new Date(d);
  return d.toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' });
}
function fmtDateShort(d) {
  if (typeof d === 'string') d = new Date(d);
  return d.toLocaleDateString('en-AU', { day:'numeric', month:'short' });
}

// BMI
function bmi(kg, cm) { return kg / Math.pow(cm/100, 2); }
function bmiClass(v) {
  if (v < 18.5) return { label:'Underweight', tone:'warn' };
  if (v < 25)   return { label:'Healthy',     tone:'ok' };
  if (v < 30)   return { label:'Overweight',  tone:'warn' };
  return { label:'Obese', tone:'bad' };
}

// Milestones built from start→goal, split into 4 equal chunks.
function buildMilestones(startWeight, goalWeight, kgPerWeek, startDate) {
  const delta = startWeight - goalWeight;
  const stepW = delta / 4;
  const start = new Date(startDate);
  const stepWeeks = stepW / kgPerWeek;
  const items = [];
  for (let i = 1; i <= 4; i++) {
    const w = +(startWeight - stepW * i).toFixed(1);
    const d = new Date(start.getTime() + i * stepWeeks * 7 * 86400000);
    const labels = [
      'First 7 kg — clothes start to fit',
      'Halfway — energy + sleep lift',
      'Three quarters — BMI into healthy range',
      'Goal — maintain mode',
    ];
    items.push({ i, weightKg: w, date: d, label: labels[i-1] });
  }
  return items;
}

Object.assign(window, {
  USER, WEIGHT_LOG, FOOD_TODAY, FASTING, EXERCISE_LOG, PHOTOS,
  bmr, tdee, KCAL_PER_KG, projectTimeline, fmtDate, fmtDateShort,
  bmi, bmiClass, buildMilestones,
});
