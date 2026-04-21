import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { currentWeight, fmtDate, targetKcalFor } from '../lib/health';
import { todayISO } from '../lib/dates';
import { ProgressRing } from '../components/ProgressRing';
import { MacroBar } from '../components/MacroBar';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { LogFoodForm } from '../components/forms/LogFoodForm';
import type { MealKind } from '../lib/types';

const MEALS: MealKind[] = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

export function Food() {
  const user = useStore((s) => s.user);
  const foodLog = useStore((s) => s.foodLog);
  const weightLog = useStore((s) => s.weightLog);
  const prefs = useStore((s) => s.prefs);
  const deleteFood = useStore((s) => s.deleteFood);

  const [date, setDate] = useState(todayISO());
  const [modal, setModal] = useState<null | MealKind | 'any'>(null);

  const kg = currentWeight(weightLog, user.startWeight);
  const target = targetKcalFor(user, kg, prefs.paceKgPerWeek);

  const today = useMemo(() => foodLog.filter((f) => f.date === date), [foodLog, date]);
  const eaten = today.reduce((s, f) => s + f.kcal, 0);
  const left = target - eaten;
  const macroP = today.reduce((s, f) => s + f.p, 0);
  const macroC = today.reduce((s, f) => s + f.c, 0);
  const macroF = today.reduce((s, f) => s + f.f, 0);

  const byMeal: Record<MealKind, typeof today> = {
    Breakfast: [],
    Lunch: [],
    Snack: [],
    Dinner: [],
  };
  today.forEach((f) => byMeal[f.meal].push(f));

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Food</h1>
          <div className="page-sub">
            {eaten} of {target} kcal · {left} remaining
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="date"
            className="px-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: 160 }}
            max={todayISO()}
          />
          <button className="px-btn is-primary" onClick={() => setModal('any')}>
            <Icon.plus size={16} /> Add food
          </button>
        </div>
      </div>

      <div className="stack-lg">
        <div className="px-card" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div>
              <div className="px-caption">Remaining</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <span
                  className="px-num"
                  style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-1.2px', lineHeight: 1 }}
                >
                  {left}
                </span>
                <span style={{ fontSize: 14, color: '#6a6a6a', fontWeight: 600 }}>kcal</span>
              </div>
              <div className="px-meta-sm" style={{ marginTop: 6 }}>
                {eaten} of {target} target
              </div>
            </div>
            <ProgressRing
              pct={target > 0 ? (eaten / target) * 100 : 0}
              color="#b45309"
              size={92}
              thickness={9}
            >
              <div className="px-num" style={{ fontSize: 16, fontWeight: 700 }}>
                {target > 0 ? Math.round((eaten / target) * 100) : 0}%
              </div>
            </ProgressRing>
          </div>
          <hr className="px-hr" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <MacroBar label="Protein" value={macroP} target={user.proteinTargetG} color="#be123c" />
            <MacroBar label="Carbs" value={macroC} target={user.carbTargetG} color="#b45309" />
            <MacroBar label="Fat" value={macroF} target={user.fatTargetG} color="#6b21a8" />
          </div>
        </div>

        {MEALS.map((meal) => {
          const items = byMeal[meal];
          const mealCals = items.reduce((s, f) => s + f.kcal, 0);
          return (
            <div key={meal} className="px-card" style={{ padding: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div className="px-title-sm">{meal}</div>
                <div className="px-meta-sm px-num">{mealCals} kcal</div>
              </div>
              {items.length === 0 ? (
                <button
                  className="px-btn is-secondary"
                  style={{ width: '100%', marginTop: 12, justifyContent: 'flex-start' }}
                  onClick={() => setModal(meal)}
                >
                  <Icon.plus size={16} /> Add {meal.toLowerCase()}
                </button>
              ) : (
                <div style={{ marginTop: 10 }}>
                  {items.map((it) => (
                    <div
                      key={it.id}
                      style={{
                        padding: '10px 0',
                        borderTop: '1px solid #ebebeb',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.2px' }}>
                          {it.name}
                        </div>
                        <div className="px-meta-sm" style={{ marginTop: 1 }}>
                          {it.time} · P {it.p}g · C {it.c}g · F {it.f}g
                        </div>
                      </div>
                      <div className="px-num" style={{ fontWeight: 600, fontSize: 14 }}>
                        {it.kcal}
                      </div>
                      <button
                        className="px-btn is-ghost is-sm"
                        onClick={() => {
                          if (confirm(`Remove ${it.name}?`)) deleteFood(it.id);
                        }}
                        aria-label="Remove"
                        style={{ padding: '6px 8px' }}
                      >
                        <Icon.trash size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="px-btn is-ghost is-sm"
                    style={{ marginTop: 8, padding: '6px 0', color: '#ff385c' }}
                    onClick={() => setModal(meal)}
                  >
                    <Icon.plus size={14} /> Add more
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {date !== todayISO() && (
          <div className="px-meta-sm" style={{ textAlign: 'center' }}>
            Showing {fmtDate(date)}
          </div>
        )}
      </div>

      <Modal open={modal !== null} title="Add food" onClose={() => setModal(null)}>
        <LogFoodForm
          initialMeal={modal && modal !== 'any' ? modal : undefined}
          onDone={() => setModal(null)}
        />
      </Modal>
    </>
  );
}
