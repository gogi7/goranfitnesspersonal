// Shared SVG icons + lightweight chart primitives for Pulse.

const Icon = {
  // Feather-ish, 1.5 stroke, matches Lucide silhouette used by Socket Atlas.
  home: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V11z"/>
    </svg>
  ),
  scale: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 11l2-3h6l2 3"/><path d="M12 11v4"/>
    </svg>
  ),
  food: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 3v9a3 3 0 006 0V3"/><path d="M8 3v18"/><path d="M16 3c-1.5 2-2 4-2 6 0 1.5.5 2.5 2 3v9"/>
    </svg>
  ),
  clock: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  run: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="17" cy="4" r="2"/><path d="M7 21l3-6 4 2-1 4"/><path d="M10 11l3-3 3 2 3-1"/><path d="M5 9l3-1 3 2"/>
    </svg>
  ),
  photo: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="M21 17l-5-5-8 8"/>
    </svg>
  ),
  map: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"/><path d="M9 3v15"/><path d="M15 6v15"/>
    </svg>
  ),
  plus: (p={}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  arrow: (p={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  ),
  arrowDown: (p={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 13l7 7 7-7"/>
    </svg>
  ),
  check: (p={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12l5 5L20 7"/>
    </svg>
  ),
  flame: (p={}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3c2 4 6 6 6 11a6 6 0 01-12 0c0-2 1-3 2-4 .5 1.5 1.5 2 1.5 2S10 9 12 3z"/>
    </svg>
  ),
  trophy: (p={}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 4h10v4a5 5 0 01-10 0V4z"/><path d="M7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3"/><path d="M10 14h4v3l1 3H9l1-3z"/>
    </svg>
  ),
  settings: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.3.9a7 7 0 00-2.1-1.2L14 3h-4l-.5 2.5a7 7 0 00-2.1 1.2L5.1 5.8l-2 3.5 2 1.5A7 7 0 005 12a7 7 0 00.1 1.2l-2 1.5 2 3.5 2.3-.9a7 7 0 002.1 1.2L10 21h4l.5-2.5a7 7 0 002.1-1.2l2.3.9 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z"/>
    </svg>
  ),
  bell: (p={}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 8a6 6 0 0112 0c0 7 3 7 3 10H3c0-3 3-3 3-10z"/><path d="M10 20a2 2 0 004 0"/>
    </svg>
  ),
  dot: (p={}) => (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" {...p}><circle cx="4" cy="4" r="4"/></svg>
  ),
  info: (p={}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/><path d="M12 8v.5M12 11v5"/>
    </svg>
  ),
  camera: (p={}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 8h3l2-3h8l2 3h3v12H3V8z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  chevronR: (p={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 6l6 6-6 6"/>
    </svg>
  ),
  minus: (p={}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M5 12h14"/>
    </svg>
  ),
};

// Weight trend chart with projection overlay.
// Props: weightLog, startWeight, goalWeight, goalDate, kgPerWeek, today, width, height
function WeightTrendChart({ log, startWeight, goalWeight, goalDate, kgPerWeek, today, width=640, height=260, showProjection=true, compact=false }) {
  const start = new Date(log[0].date);
  const end = new Date(goalDate);
  const totalMs = end - start;
  const pad = { l: 40, r: 20, t: compact ? 16 : 24, b: 28 };
  const w = width, h = height;
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  // y range — goal-2 to startWeight+2
  const yMax = Math.max(startWeight, log[0].kg) + 2;
  const yMin = Math.min(goalWeight, log[log.length-1].kg) - 2;
  const yToPx = (v) => pad.t + plotH * (1 - (v - yMin) / (yMax - yMin));
  const tToPx = (d) => pad.l + plotW * ((new Date(d) - start) / totalMs);

  // projection line (from today forward)
  const todayDate = new Date(today);
  const todayWeight = log.find(l => l.date === today)?.kg ?? log[log.length-1].kg;
  const projPath = `M ${tToPx(today)} ${yToPx(todayWeight)} L ${tToPx(goalDate)} ${yToPx(goalWeight)}`;

  // actual line
  const actual = log.map((p, i) => `${i===0?'M':'L'} ${tToPx(p.date)} ${yToPx(p.kg)}`).join(' ');

  // y axis ticks
  const yTicks = [];
  const stepY = Math.ceil((yMax - yMin) / 4);
  for (let v = Math.ceil(yMin); v <= yMax; v += stepY) yTicks.push(v);

  // x axis — month ticks between start & end
  const xTicks = [];
  {
    let d = new Date(start.getFullYear(), start.getMonth(), 1);
    while (d <= end) {
      if (d >= start) xTicks.push(new Date(d));
      d = new Date(d.getFullYear(), d.getMonth()+1, 1);
    }
  }

  // goal band
  const goalY = yToPx(goalWeight);

  return (
    <svg className="px-chart" viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {/* grid */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={pad.l} x2={w - pad.r} y1={yToPx(v)} y2={yToPx(v)} stroke="#ebebeb" strokeWidth="1"/>
          <text x={pad.l - 8} y={yToPx(v) + 4} textAnchor="end" fontSize="10" fill="#6a6a6a" fontWeight="500">{v}</text>
        </g>
      ))}
      {/* goal line */}
      <line x1={pad.l} x2={w - pad.r} y1={goalY} y2={goalY} stroke="#16a34a" strokeWidth="1.25" strokeDasharray="3 4"/>
      <text x={w - pad.r - 4} y={goalY - 4} textAnchor="end" fontSize="10" fill="#16a34a" fontWeight="700">GOAL {goalWeight}kg</text>

      {/* projection */}
      {showProjection && (
        <>
          <path d={projPath} stroke="#ff385c" strokeWidth="1.5" strokeDasharray="2 4" fill="none" opacity="0.8"/>
          <circle cx={tToPx(goalDate)} cy={yToPx(goalWeight)} r="4" fill="#ff385c"/>
        </>
      )}
      {/* actual */}
      <path d={actual} stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {log.map(p => (
        <circle key={p.date} cx={tToPx(p.date)} cy={yToPx(p.kg)} r="2.5" fill="#222"/>
      ))}
      {/* today marker */}
      <line x1={tToPx(today)} x2={tToPx(today)} y1={pad.t} y2={h - pad.b} stroke="#ff385c" strokeWidth="1" opacity="0.35"/>
      <circle cx={tToPx(today)} cy={yToPx(todayWeight)} r="5" fill="#ff385c" stroke="#fff" strokeWidth="2"/>

      {/* x labels */}
      {xTicks.map((d,i) => (
        <text key={i} x={tToPx(d)} y={h - 8} textAnchor="middle" fontSize="10" fill="#6a6a6a" fontWeight="500">
          {d.toLocaleDateString('en-AU', { month:'short' })}{d.getMonth()===0 ? ` ’${String(d.getFullYear()).slice(2)}` : ''}
        </text>
      ))}
    </svg>
  );
}

// Tiny sparkline
function Sparkline({ values, width=120, height=36, color='#222' }) {
  if (!values.length) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v,i) => {
    const x = (i / (values.length - 1)) * (width-4) + 2;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={(values.length-1)/(values.length-1)*(width-4)+2} cy={height-2 - ((values[values.length-1]-min)/range)*(height-4)} r="2.5" fill={color}/>
    </svg>
  );
}

// Bar mini for macro
function MacroBar({ label, value, target, color }) {
  const pct = Math.min(100, (value/target)*100);
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:600, color:'#222', marginBottom:4}}>
        <span>{label}</span><span className="px-num" style={{color:'#6a6a6a', fontWeight:500}}>{value}/{target}g</span>
      </div>
      <div className="px-bar"><i style={{width:`${pct}%`, background:color}}/></div>
    </div>
  );
}

Object.assign(window, { Icon, WeightTrendChart, Sparkline, MacroBar });
