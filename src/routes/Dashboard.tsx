import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import {
  bmi,
  bmiClass,
  currentWeight,
  fmtDate,
  fmtDateShort,
  projectTimeline,
  tdee,
  targetKcalFor,
} from '../lib/health';
import { hoursBetween, todayISO } from '../lib/dates';
import { ProgressRing } from '../components/ProgressRing';
import { MacroBar } from '../components/MacroBar';
import { WeightTrendChart } from '../components/WeightTrendChart';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { LogWeightForm } from '../components/forms/LogWeightForm';
import { LogFoodForm } from '../components/forms/LogFoodForm';
import { LogWorkoutForm } from '../components/forms/LogWorkoutForm';
import { StartFastForm } from '../components/forms/StartFastForm';

type ModalKind = null | 'weight' | 'food' | 'fast' | 'workout';

export function Dashboard() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const weightLog = useStore((s) => s.weightLog);
  const foodLog = useStore((s) => s.foodLog);
  const fasting = useStore((s) => s.fasting);
  const exerciseLog = useStore((s) => s.exerciseLog);
  const prefs = useStore((s) => s.prefs);
  const endFast = useStore((s) => s.endFast);

  const [modal, setModal] = useState<ModalKind>(null);
  const today = todayISO();

  const kg = currentWeight(weightLog, user.startWeight);
  const lost = Math.max(0, +(user.startWeight - kg).toFixed(1));
  const toGo = Math.max(0, +(kg - user.goalWeight).toFixed(1));
  const bmiV = bmi(kg, user.heightCm);
  const bmiCls = bmiClass(bmiV);
  const tdeeVal = tdee({
    weightKg: kg,
    heightCm: user.heightCm,
    age: user.age,
    sex: user.sex,
    activityFactor: user.activityFactor,
  });
  const target = targetKcalFor(user, kg, prefs.paceKgPerWeek);

  const todaysFood = useMemo(() => foodLog.filter((f) => f.date === today), [foodLog, today]);
  const eaten = todaysFood.reduce((s, f) => s + f.kcal, 0);
  const macroP = todaysFood.reduce((s, f) => s + f.p, 0);
  const macroC = todaysFood.reduce((s, f) => s + f.c, 0);
  const macroF = todaysFood.reduce((s, f) => s + f.f, 0);

  const todaysExercise = useMemo(
    () => exerciseLog.filter((e) => e.date === today),
    [exerciseLog, today]
  );
  const burned = todaysExercise.reduce((s, e) => s + e.kcal, 0);

  const fastHrs = fasting.active && fasting.startedAt ? hoursBetween(fasting.startedAt, new Date()) : 0;
  const fastPct = fasting.goalHours > 0 ? Math.min(100, (fastHrs / fasting.goalHours) * 100) : 0;

  const { end, weeksRemaining } = projectTimeline({
    startWeight: user.startWeight,
    goalWeight: user.goalWeight,
    kgPerWeek: prefs.paceKgPerWeek,
    startDate: user.startDate,
    currentWeight: kg,
  });

  const progressPct =
    user.startWeight > user.goalWeight
      ? ((user.startWeight - kg) / (user.startWeight - user.goalWeight)) * 100
      : 0;

  const closeModal = () => setModal(null);

  return (
    <>
      <div className="page-head hidden-mobile">
        <div>
          <h1 className="page-title">Good day, {user.name.split(' ')[0]}</h1>
          <div className="page-sub">
            {fmtDate(new Date())} · {weeksRemaining} weeks to {user.goalWeight} kg at{' '}
            {prefs.paceKgPerWeek.toFixed(2)} kg/wk
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="px-btn is-primary" onClick={() => setModal('weight')}>
            <Icon.plus size={16} /> Log weight
          </button>
        </div>
      </div>

      <div className="stack-lg">
        {/* Hero card */}
        <div className="px-card" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 220px' }}>
              <div className="px-caption">Current weight</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                <span
                  className="px-num"
                  style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-1.2px', lineHeight: 1 }}
                >
                  {kg.toFixed(1)}
                </span>
                <span style={{ fontSize: 16, color: '#6a6a6a', fontWeight: 600 }}>kg</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                {lost > 0 ? (
                  <span className="px-badge is-ok">
                    <Icon.arrowDown size={10} /> −{lost} kg
                  </span>
                ) : (
                  <span className="px-badge is-neutral">First entry</span>
                )}
                <span className="px-meta-sm">since {fmtDateShort(user.startDate)}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="px-caption">BMI</div>
              <div
                className="px-num"
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: '-0.44px',
                  marginTop: 4,
                }}
              >
                {bmiV.toFixed(1)}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: bmiCls.tone === 'ok' ? '#16a34a' : bmiCls.tone === 'warn' ? '#f59e0b' : '#ff385c',
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {bmiCls.label}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              <span className="px-meta-sm">{kg.toFixed(1)} kg</span>
              <span className="px-meta-sm">Goal · {user.goalWeight.toFixed(1)} kg</span>
            </div>
            <div className="px-bar is-accent">
              <i style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }} />
            </div>
            <div className="px-meta-sm" style={{ marginTop: 8 }}>
              {toGo.toFixed(1)} kg to goal · projected{' '}
              <b style={{ color: '#222' }}>{fmtDateShort(end)}</b> at{' '}
              {prefs.paceKgPerWeek.toFixed(2)} kg/wk
            </div>
          </div>
        </div>

        {/* Weight chart */}
        <div className="px-card" style={{ padding: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 8,
            }}
          >
            <div className="px-title-sm">Trend → Goal</div>
            <button
              className="px-btn is-ghost is-sm"
              onClick={() => navigate('/weight')}
            >
              Weight log <Icon.arrow size={12} />
            </button>
          </div>
          <WeightTrendChart
            log={weightLog}
            startWeight={user.startWeight}
            goalWeight={user.goalWeight}
            goalDate={end}
            today={today}
            width={720}
            height={220}
          />
        </div>

        {/* Today's rings */}
        <div className="px-card" style={{ padding: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 12,
            }}
          >
            <div className="px-title-sm">Today</div>
            <div className="px-meta-sm px-num">
              {eaten}/{target} kcal
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <RingStat
              pct={target > 0 ? (eaten / target) * 100 : 0}
              color="#b45309"
              label="Eaten"
              value={`${eaten}`}
              unit="kcal"
              onClick={() => navigate('/food')}
            />
            <RingStat
              pct={fastPct}
              color="#6b21a8"
              label={fasting.active ? 'Fasting' : 'No fast'}
              value={
                fasting.active
                  ? `${Math.floor(fastHrs)}h ${Math.round((fastHrs % 1) * 60)}m`
                  : '—'
              }
              unit={fasting.active ? `of ${fasting.goalHours}h` : 'tap to start'}
              onClick={() => (fasting.active ? navigate('/fasting') : setModal('fast'))}
            />
            <RingStat
              pct={burned > 0 ? (burned / 400) * 100 : 0}
              color="#0f766e"
              label="Move"
              value={`${burned}`}
              unit="kcal"
              onClick={() => navigate('/exercise')}
            />
          </div>
          <hr className="px-hr" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <MacroBar label="Protein" value={macroP} target={user.proteinTargetG} color="#be123c" />
            <MacroBar label="Carbs" value={macroC} target={user.carbTargetG} color="#b45309" />
            <MacroBar label="Fat" value={macroF} target={user.fatTargetG} color="#6b21a8" />
          </div>
        </div>

        {/* Energy balance */}
        <div className="px-card" style={{ padding: 16 }}>
          <div className="px-title-sm" style={{ marginBottom: 10 }}>
            Energy balance
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div className="px-meta-sm">Eaten − burned</div>
              <div
                className="px-num"
                style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.6px' }}
              >
                {eaten - burned}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="px-meta-sm">Target (deficit)</div>
              <div className="px-num" style={{ fontSize: 20, fontWeight: 600 }}>
                ≤ {target}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              background: '#fff0f3',
              padding: '10px 12px',
              borderRadius: 10,
              fontSize: 12,
              color: '#be123c',
              fontWeight: 600,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Icon.flame size={14} /> Deficit of ~{tdeeVal - (eaten - burned)} kcal vs. TDEE
          </div>
        </div>

        {/* Quick log */}
        <div>
          <div className="px-title-sm" style={{ margin: '0 4px 10px' }}>
            Quick log
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <QuickTile
              icon={<Icon.scale size={18} />}
              label="Weight"
              sub={`Last: ${kg.toFixed(1)} kg`}
              onClick={() => setModal('weight')}
            />
            <QuickTile
              icon={<Icon.food size={18} />}
              label="Food"
              sub={`${eaten} kcal today`}
              onClick={() => setModal('food')}
            />
            <QuickTile
              icon={<Icon.clock size={18} />}
              label={fasting.active ? 'End fast' : 'Start fast'}
              sub={
                fasting.active
                  ? `${Math.floor(fastHrs)}h · ${fasting.plan}`
                  : `${prefs.fastingPlanDefault}`
              }
              onClick={() => (fasting.active ? endFast() : setModal('fast'))}
            />
            <QuickTile
              icon={<Icon.run size={18} />}
              label="Workout"
              sub={
                todaysExercise.length
                  ? `${todaysExercise[0].type} · ${todaysExercise[0].minutes} min`
                  : 'Log activity'
              }
              onClick={() => setModal('workout')}
            />
          </div>
        </div>

        {/* Roadmap preview */}
        <div
          className="px-card lift"
          onClick={() => navigate('/roadmap')}
          style={{ padding: 16, cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate('/roadmap');
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(180deg,#fde0e4,#f4b3bc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#be123c',
              }}
            >
              <Icon.trophy size={24} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px' }}>
                On pace to hit {user.goalWeight} kg by {fmtDateShort(end)}
              </div>
              <div className="px-meta-sm" style={{ marginTop: 2 }}>
                {weeksRemaining} weeks · {prefs.paceKgPerWeek.toFixed(2)} kg/wk · see full roadmap
              </div>
            </div>
            <Icon.chevronR size={14} />
          </div>
        </div>
      </div>

      <Modal open={modal === 'weight'} title="Log weight" onClose={closeModal}>
        <LogWeightForm onDone={closeModal} />
      </Modal>
      <Modal open={modal === 'food'} title="Add food" onClose={closeModal}>
        <LogFoodForm onDone={closeModal} />
      </Modal>
      <Modal open={modal === 'fast'} title="Start fast" onClose={closeModal}>
        <StartFastForm onDone={closeModal} />
      </Modal>
      <Modal open={modal === 'workout'} title="Log workout" onClose={closeModal}>
        <LogWorkoutForm onDone={closeModal} />
      </Modal>
    </>
  );
}

interface RingStatProps {
  pct: number;
  color: string;
  label: string;
  value: string;
  unit: string;
  onClick?: () => void;
}

function RingStat({ pct, color, label, value, unit, onClick }: RingStatProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 0,
        padding: 0,
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: 'inherit',
      }}
    >
      <ProgressRing pct={pct} color={color} size={88} thickness={8}>
        <div className="px-num" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.2px' }}>
          {value}
        </div>
        <div style={{ fontSize: 9, color: '#6a6a6a', fontWeight: 600, marginTop: 1 }}>{unit}</div>
      </ProgressRing>
      <div className="px-caption" style={{ marginTop: 8 }}>
        {label}
      </div>
    </button>
  );
}

interface QuickTileProps {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
}

function QuickTile({ icon, label, sub, onClick }: QuickTileProps) {
  return (
    <button
      onClick={onClick}
      className="px-card lift"
      style={{
        padding: 14,
        border: 0,
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: '#f7f7f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#222',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>{label}</div>
        <div
          className="px-meta-sm"
          style={{ marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {sub}
        </div>
      </div>
    </button>
  );
}
