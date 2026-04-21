// Web (desktop) dashboard for Pulse

function WebApp({ initial='home', roadmapVariant='timeline' }) {
  const [screen, setScreen] = React.useState(initial);
  return (
    <div className="px-web">
      <WebSidebar active={screen} onNav={setScreen}/>
      <div className="px-main">
        {screen==='home' && <WebDashboard onNav={setScreen}/>}
        {screen==='weight' && <WebWeight/>}
        {screen==='food' && <WebFood/>}
        {screen==='fast' && <WebFast/>}
        {screen==='exercise' && <WebExercise/>}
        {screen==='roadmap' && <WebRoadmap variant={roadmapVariant}/>}
        {screen==='photos' && <WebPhotos/>}
      </div>
    </div>
  );
}

function WebSidebar({ active, onNav }) {
  const items = [
    { k:'home', icon: Icon.home, l:'Dashboard' },
    { k:'weight', icon: Icon.scale, l:'Weight' },
    { k:'food', icon: Icon.food, l:'Food' },
    { k:'fast', icon: Icon.clock, l:'Fasting' },
    { k:'exercise', icon: Icon.run, l:'Exercise' },
    { k:'roadmap', icon: Icon.map, l:'Roadmap' },
    { k:'photos', icon: Icon.photo, l:'Progress photos' },
  ];
  return (
    <div className="px-sidebar">
      <div className="px-brand">
        <svg className="px-brand-mark" viewBox="0 0 28 28" fill="none">
          <path d="M2 14h5l2-6 4 12 2-8 3 4h8" stroke="#ff385c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="px-brand-word">Pulse</div>
      </div>
      {items.map(it => (
        <div key={it.k} className={`px-nav-item ${active===it.k?'is-active':''}`} onClick={()=>onNav(it.k)}>
          <it.icon/> {it.l}
        </div>
      ))}
      <div style={{flex:1}}/>
      <div className="px-nav-item"><Icon.settings/> Settings</div>
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'12px 12px', marginTop:8, borderTop:'1px solid #ebebeb'}}>
        <div style={{width:32, height:32, borderRadius:999, background:'#222', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12}}>GB</div>
        <div>
          <div style={{fontSize:13, fontWeight:600}}>Goran Babić</div>
          <div className="px-meta-sm" style={{fontSize:11}}>41 · 180cm</div>
        </div>
      </div>
    </div>
  );
}

function WebDashboard({ onNav }) {
  const today = WEIGHT_LOG[WEIGHT_LOG.length-1];
  const lost = (USER.startWeight - today.kg).toFixed(1);
  const bmiV = bmi(today.kg, USER.heightCm);
  const tdeeVal = tdee({ weightKg: today.kg, heightCm: USER.heightCm, age: USER.age, sex: USER.sex, activityFactor: USER.activityFactor });
  const targetKcal = tdeeVal - 1100;
  const eaten = FOOD_TODAY.reduce((s,f)=>s+f.kcal,0);
  const macroP = FOOD_TODAY.reduce((s,f)=>s+f.p,0);
  const macroC = FOOD_TODAY.reduce((s,f)=>s+f.c,0);
  const macroF = FOOD_TODAY.reduce((s,f)=>s+f.f,0);
  const fastStart = new Date(FASTING.startedAt);
  const now = new Date('2026-04-21T12:30');
  const hrs = (now - fastStart)/3600000;
  const { weeks, end } = projectTimeline({ startWeight: USER.startWeight, goalWeight: USER.goalWeight, kgPerWeek: 1.0, startDate: USER.startDate });

  return (
    <>
      <div className="px-main-head">
        <div>
          <div className="px-main-title">Good afternoon, Goran</div>
          <div className="px-main-sub">Tuesday 21 April 2026 · {weeks} weeks to 79 kg at 1.0 kg/wk</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button className="px-btn is-secondary"><Icon.bell/></button>
          <button className="px-btn is-primary"><Icon.plus/> Log</button>
        </div>
      </div>

      {/* Hero row — weight + today's energy */}
      <div className="px-grid" style={{gridTemplateColumns:'1.3fr 1fr', marginBottom:20}}>
        {/* Weight + projection */}
        <div className="px-card" style={{padding:24}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16}}>
            <div>
              <div className="px-caption">Current weight</div>
              <div style={{display:'flex', alignItems:'baseline', gap:6, marginTop:8}}>
                <span className="px-num" style={{fontSize:56, fontWeight:700, letterSpacing:'-1.4px', lineHeight:1}}>{today.kg}</span>
                <span style={{fontSize:18, color:'#6a6a6a', fontWeight:600}}>kg</span>
                <span className="px-badge is-ok" style={{marginLeft:12}}><Icon.arrowDown width="10" height="10"/> −{lost} kg (3 wks)</span>
              </div>
              <div className="px-meta" style={{marginTop:8}}>BMI {bmiV.toFixed(1)} · {bmiClass(bmiV).label} · goal 79 kg (BMI 24.4)</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="px-caption">Projected goal date</div>
              <div className="px-num" style={{fontSize:22, fontWeight:700, letterSpacing:'-0.3px', marginTop:6, color:'#ff385c'}}>{fmtDate(end)}</div>
              <div className="px-meta-sm" style={{marginTop:2}}>{weeks} wks · 1.0 kg/wk pace</div>
            </div>
          </div>
          <WeightTrendChart log={WEIGHT_LOG} startWeight={USER.startWeight} goalWeight={USER.goalWeight}
            goalDate={end} kgPerWeek={1.0} today="2026-04-21" width={720} height={240}/>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4}}>
            <div style={{display:'flex', gap:14, fontSize:12, fontWeight:600, color:'#6a6a6a'}}>
              <span style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:10, height:2, background:'#222'}}/>Actual</span>
              <span style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:10, height:2, background:'#ff385c', borderTop:'1px dashed #ff385c'}}/>Projection</span>
              <span style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:10, height:2, background:'#16a34a'}}/>Goal 79 kg</span>
            </div>
            <button className="px-btn is-ghost is-sm" onClick={()=>onNav('weight')}>Open weight log <Icon.arrow/></button>
          </div>
        </div>

        {/* Today's rings */}
        <div className="px-card" style={{padding:24}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:20}}>
            <div className="px-title">Today</div>
            <div className="px-meta-sm px-num">Net: {eaten - EXERCISE_LOG[0].kcal} kcal</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20}}>
            <BigRing pct={(eaten/targetKcal)*100} col="#b45309" title="Eaten" value={`${eaten}`} unit={`/ ${targetKcal}`}/>
            <BigRing pct={(hrs/FASTING.goalHours)*100} col="#6b21a8" title="Fasting" value={`${Math.floor(hrs)}h`} unit={`/ 16h`}/>
            <BigRing pct={(EXERCISE_LOG[0].kcal/400)*100} col="#0f766e" title="Move" value={`${EXERCISE_LOG[0].kcal}`} unit="kcal"/>
          </div>
          <MacroBar label="Protein" value={macroP} target={160} color="#be123c"/>
          <div style={{height:10}}/>
          <MacroBar label="Carbs" value={macroC} target={160} color="#b45309"/>
          <div style={{height:10}}/>
          <MacroBar label="Fat" value={macroF} target={55} color="#6b21a8"/>
        </div>
      </div>

      {/* Second row — milestones, fasting, exercise */}
      <div className="px-grid" style={{gridTemplateColumns:'1.3fr 1fr', marginBottom:20}}>
        <div className="px-card" style={{padding:24}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16}}>
            <div className="px-title">Roadmap to 79 kg</div>
            <button className="px-btn is-ghost is-sm" onClick={()=>onNav('roadmap')}>Full roadmap <Icon.arrow/></button>
          </div>
          <InlineRoadmap/>
        </div>
        <div className="px-card" style={{padding:24}}>
          <div className="px-title" style={{marginBottom:16}}>Week at a glance</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, marginBottom:16}}>
            {['M','T','W','T','F','S','S'].map((d,i) => {
              const kg = [108.2,108.0,null,107.8,null,107.6,107.3][i];
              const fast = [16,17,15,16,0,18,14][i];
              const ex = [0, 75, 0, 30, 0, 40, 0][i];
              return (
                <div key={i} style={{display:'flex', flexDirection:'column', gap:4}}>
                  <div className="px-caption" style={{textAlign:'center', marginBottom:2}}>{d}</div>
                  <div style={{height:80, background:'#f7f7f7', borderRadius:8, position:'relative', overflow:'hidden'}}>
                    <div style={{position:'absolute', bottom:0, left:0, right:0, height:`${(fast/20)*100}%`, background: i===4?'#ebebeb':'#6b21a8', opacity:0.8}}/>
                  </div>
                  <div className="px-num" style={{fontSize:11, fontWeight:700, textAlign:'center'}}>{kg ? kg.toFixed(1) : '—'}</div>
                  <div style={{textAlign:'center', fontSize:9, fontWeight:600, color: ex>0?'#0f766e':'#b0b0b0'}}>{ex>0?`${ex}m`:'rest'}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex', gap:16, fontSize:11, fontWeight:600, color:'#6a6a6a', paddingTop:12, borderTop:'1px solid #ebebeb'}}>
            <span style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:8, height:8, background:'#6b21a8', borderRadius:2}}/>Fasting hrs</span>
            <span style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:8, height:8, background:'#0f766e', borderRadius:999}}/>Exercise</span>
            <span style={{marginLeft:'auto'}}>kg below bars</span>
          </div>
        </div>
      </div>

      {/* Third row — meals, photos */}
      <div className="px-grid" style={{gridTemplateColumns:'1.3fr 1fr', marginBottom:20}}>
        <div className="px-card" style={{padding:24}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16}}>
            <div className="px-title">Food today</div>
            <button className="px-btn is-ghost is-sm" onClick={()=>onNav('food')}>Open food log <Icon.arrow/></button>
          </div>
          {FOOD_TODAY.map(it => (
            <div key={it.id} style={{padding:'12px 0', borderTop:'1px solid #ebebeb', display:'flex', gap:14, alignItems:'center'}}>
              <span className="px-caption" style={{width:90}}>{it.meal} · {it.time}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14, fontWeight:600, letterSpacing:'-0.2px'}}>{it.name}</div>
                <div className="px-meta-sm">P {it.p}g · C {it.c}g · F {it.f}g</div>
              </div>
              <div className="px-num" style={{fontSize:16, fontWeight:700}}>{it.kcal}</div>
              <div style={{fontSize:11, color:'#6a6a6a', fontWeight:500, width:30}}>kcal</div>
            </div>
          ))}
          <button className="px-btn is-secondary" style={{marginTop:12}}><Icon.plus/> Add dinner</button>
        </div>
        <div className="px-card" style={{padding:24}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16}}>
            <div className="px-title">Progress photos</div>
            <button className="px-btn is-ghost is-sm" onClick={()=>onNav('photos')}>Compare <Icon.arrow/></button>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <PhotoTile label="1 Apr" weight="109.4 kg"/>
            <PhotoTile label="21 Apr" weight="107.0 kg" current/>
          </div>
          <div className="px-meta-sm" style={{marginTop:12}}>−2.4 kg · first 3 weeks. Next photo suggested 28 Apr.</div>
        </div>
      </div>
    </>
  );
}

function BigRing({ pct, col, title, value, unit }) {
  return (
    <div style={{textAlign:'center'}}>
      <div className="px-ring" style={{'--pct':pct, '--col':col, '--sz':'110px', '--th':'9px', margin:'0 auto'}}>
        <div className="px-ring-inner">
          <div className="px-num" style={{fontSize:20, fontWeight:700, letterSpacing:'-0.3px'}}>{value}</div>
          <div className="px-meta-sm" style={{fontSize:10}}>{unit}</div>
        </div>
      </div>
      <div className="px-caption" style={{marginTop:10}}>{title}</div>
    </div>
  );
}

function InlineRoadmap() {
  const { end } = projectTimeline({ startWeight: USER.startWeight, goalWeight: USER.goalWeight, kgPerWeek: 1.0, startDate: USER.startDate });
  const ms = buildMilestones(USER.startWeight, USER.goalWeight, 1.0, USER.startDate);
  const nodes = [
    { d:'1 Apr', w:'109.4', label:'Start', done:true },
    { d:'21 Apr', w:'107.0', label:'Today', current:true },
    ...ms.map(m => ({ d: fmtDateShort(m.date), w: m.weightKg.toFixed(1), label: m.label })),
  ];
  return (
    <div style={{position:'relative', padding:'24px 10px 10px'}}>
      <div style={{position:'absolute', left:20, right:20, top:44, height:2, background:'#ebebeb'}}/>
      <div style={{display:'flex', justifyContent:'space-between', position:'relative'}}>
        {nodes.map((n,i) => (
          <div key={i} style={{flex:1, textAlign:'center', minWidth:0}}>
            <div className="px-num" style={{fontSize:14, fontWeight:700, marginBottom:8, color:n.current?'#ff385c':'#222'}}>{n.w} kg</div>
            <div style={{display:'flex', justifyContent:'center', marginBottom:8}}>
              <div style={{width:16, height:16, borderRadius:999,
                background: n.current?'#ff385c' : n.done?'#222' : '#fff',
                border: n.done||n.current ? 'none' : '2px solid #dddddd',
                boxShadow: n.current?'0 0 0 4px #fff, 0 0 0 6px #ff385c':'0 0 0 4px #fff'}}/>
            </div>
            <div style={{fontSize:11, fontWeight:700, color: n.current?'#ff385c':'#222'}}>{n.d}</div>
            <div className="px-meta-sm" style={{fontSize:10, marginTop:2, lineHeight:1.3, padding:'0 4px'}}>{n.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Sub-pages (lighter, since mobile is the hero focus) ---
function WebWeight() {
  const { end } = projectTimeline({ startWeight: USER.startWeight, goalWeight: USER.goalWeight, kgPerWeek: 1.0, startDate: USER.startDate });
  return (
    <>
      <div className="px-main-head">
        <div>
          <div className="px-main-title">Weight</div>
          <div className="px-main-sub">107.0 kg · −2.4 kg since start · {Math.round((USER.startWeight-107)/(USER.startWeight-USER.goalWeight)*100)}% of the way to 79 kg</div>
        </div>
        <button className="px-btn is-primary"><Icon.plus/> Log weight</button>
      </div>
      <div className="px-card" style={{padding:24, marginBottom:20}}>
        <WeightTrendChart log={WEIGHT_LOG} startWeight={USER.startWeight} goalWeight={USER.goalWeight} goalDate={end} kgPerWeek={1.0} today="2026-04-21" width={1100} height={320}/>
      </div>
      <div className="px-card" style={{padding:24}}>
        <div className="px-title" style={{marginBottom:16}}>Entries</div>
        {WEIGHT_LOG.slice().reverse().map((r,i) => {
          const prev = WEIGHT_LOG[WEIGHT_LOG.length-1-i-1];
          const delta = prev ? (r.kg - prev.kg) : 0;
          return (
            <div key={r.date} style={{display:'grid', gridTemplateColumns:'140px 1fr 120px 80px', padding:'12px 0', borderTop: i===0?'none':'1px solid #ebebeb', alignItems:'center'}}>
              <div style={{fontSize:14, fontWeight:600}}>{fmtDate(r.date)}</div>
              <div className="px-meta-sm">{i===0?'Today':`${i*2} days ago`}</div>
              <div className="px-num" style={{fontSize:17, fontWeight:700}}>{r.kg} kg</div>
              {prev && <span className={`px-badge ${delta<0?'is-ok':delta>0?'is-bad':'is-neutral'}`}>{delta<0?'▼':delta>0?'▲':'—'} {Math.abs(delta).toFixed(1)}</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}

function WebRoadmap({ variant='timeline' }) {
  const [pace, setPace] = React.useState(1.0);
  const { weeks, end } = projectTimeline({ startWeight: USER.startWeight, goalWeight: USER.goalWeight, kgPerWeek: pace, startDate: USER.startDate });
  const ms = buildMilestones(USER.startWeight, USER.goalWeight, pace, USER.startDate);
  const today = WEIGHT_LOG[WEIGHT_LOG.length-1];

  return (
    <>
      <div className="px-main-head">
        <div>
          <div className="px-main-title">Roadmap</div>
          <div className="px-main-sub">Where you're headed if you stay on track</div>
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <span className="px-caption">Pace:</span>
          {[0.5,0.75,1.0].map(v => (
            <button key={v} onClick={()=>setPace(v)} className={`px-pill ${pace===v?'is-sel':''}`}>{v.toFixed(2)} kg/wk</button>
          ))}
        </div>
      </div>

      <div className="px-card" style={{padding:32, marginBottom:20, background:'linear-gradient(135deg,#fff,#fff0f3)'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:40}}>
          <div>
            <div className="px-caption">Arrival at goal</div>
            <div className="px-num" style={{fontSize:40, fontWeight:700, letterSpacing:'-1px', color:'#ff385c', marginTop:4}}>{fmtDate(end)}</div>
            <div className="px-meta" style={{marginTop:4}}>{weeks} weeks from today</div>
          </div>
          <div>
            <div className="px-caption">Weight to lose</div>
            <div className="px-num" style={{fontSize:40, fontWeight:700, letterSpacing:'-1px', marginTop:4}}>{(today.kg - USER.goalWeight).toFixed(1)} kg</div>
            <div className="px-meta" style={{marginTop:4}}>{today.kg} → {USER.goalWeight} kg</div>
          </div>
          <div>
            <div className="px-caption">Daily deficit needed</div>
            <div className="px-num" style={{fontSize:40, fontWeight:700, letterSpacing:'-1px', marginTop:4}}>~{Math.round(pace*7700/7)}</div>
            <div className="px-meta" style={{marginTop:4}}>kcal below TDEE</div>
          </div>
        </div>
      </div>

      {variant === 'timeline' && <RoadmapTimeline ms={ms} today={today} pace={pace} end={end}/>}
      {variant === 'arc' && <RoadmapArc ms={ms} today={today} pace={pace} end={end}/>}
      {variant === 'stack' && <RoadmapStack ms={ms} today={today} pace={pace} end={end}/>}
    </>
  );
}

// Variation A — linear horizontal timeline (default, matches user's SVG pick)
function RoadmapTimeline({ ms, today, pace, end }) {
  const stops = [
    { d:'1 Apr 2026', w: USER.startWeight, label:'Baseline', done:true },
    { d:'21 Apr 2026', w: today.kg, label:'Today', current:true },
    ...ms.map(m => ({ d: fmtDate(m.date), w: m.weightKg, label: m.label })),
  ];
  return (
    <div className="px-card" style={{padding:32}}>
      <div className="px-title" style={{marginBottom:8}}>Milestones</div>
      <div className="px-meta" style={{marginBottom:32}}>Linear — dots along a straight path from start to goal.</div>
      <div style={{position:'relative', padding:'16px 0 32px'}}>
        <div style={{position:'absolute', left:'3%', right:'3%', top:'50%', height:2, background:'#ebebeb'}}/>
        <div style={{display:'flex', justifyContent:'space-between', position:'relative'}}>
          {stops.map((n,i) => (
            <div key={i} style={{flex:1, textAlign:'center', minWidth:0, padding:'0 8px'}}>
              <div className="px-num" style={{fontSize:22, fontWeight:700, letterSpacing:'-0.4px', color:n.current?'#ff385c':'#222', marginBottom:16}}>{n.w} kg</div>
              <div style={{display:'flex', justifyContent:'center', marginBottom:16}}>
                <div style={{width:20, height:20, borderRadius:999,
                  background: n.current?'#ff385c' : n.done?'#222' : '#fff',
                  border: n.done||n.current ? 'none' : '2px solid #dddddd',
                  boxShadow: n.current?'0 0 0 4px #fff, 0 0 0 6px #ff385c':'0 0 0 4px #fff'}}/>
              </div>
              <div style={{fontSize:12, fontWeight:700, color:n.current?'#ff385c':'#222'}}>{n.d}</div>
              <div className="px-meta-sm" style={{fontSize:11, marginTop:4, lineHeight:1.4}}>{n.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapArc({ ms, today, pace, end }) {
  // Arc / curve visualization
  return (
    <div className="px-card" style={{padding:32}}>
      <div className="px-title" style={{marginBottom:8}}>Trajectory arc</div>
      <div className="px-meta" style={{marginBottom:20}}>A curve through each milestone, falling toward goal.</div>
      <svg viewBox="0 0 1100 320" width="100%" height="320">
        <path d="M 40 40 Q 300 40 550 160 T 1060 280" stroke="#ff385c" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {[
          { x:40, y:40, w:'109.4', d:'1 Apr', l:'Start', done:true },
          { x:230, y:75, w:'107.0', d:'21 Apr', l:'Today', current:true },
          ...ms.map((m,i) => ({
            x: 400 + i*210,
            y: 110 + i*50,
            w: m.weightKg.toFixed(1),
            d: fmtDateShort(m.date),
            l: m.label,
          })),
        ].map((s,i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={s.current?10:7} fill={s.current?'#ff385c':s.done?'#222':'#fff'} stroke={s.done||s.current?'none':'#dddddd'} strokeWidth="2"/>
            {s.current && <circle cx={s.x} cy={s.y} r="14" fill="none" stroke="#ff385c" strokeWidth="2" opacity="0.3"/>}
            <text x={s.x} y={s.y-22} textAnchor="middle" fontSize="16" fontWeight="700" fill={s.current?'#ff385c':'#222'}>{s.w} kg</text>
            <text x={s.x} y={s.y+28} textAnchor="middle" fontSize="11" fontWeight="700" fill="#222">{s.d}</text>
            <text x={s.x} y={s.y+44} textAnchor="middle" fontSize="10" fill="#6a6a6a">{s.l}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RoadmapStack({ ms, today, pace, end }) {
  const all = [
    { w: USER.startWeight, d:'1 Apr', l:'Baseline', done:true },
    { w: today.kg, d:'21 Apr', l:'Today — 3 weeks in, on pace', current:true },
    ...ms.map(m => ({ w: m.weightKg, d: fmtDateShort(m.date), l: m.label })),
  ];
  return (
    <div className="px-card" style={{padding:32}}>
      <div className="px-title" style={{marginBottom:8}}>Milestone cards</div>
      <div className="px-meta" style={{marginBottom:20}}>Each checkpoint on its own card — what weight, when, and what it means.</div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16}}>
        {all.map((s,i) => (
          <div key={i} className="px-card lift" style={{padding:20, border: s.current?'2px solid #ff385c':'none'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div className="px-caption" style={{color: s.current?'#ff385c':'#6a6a6a'}}>{s.current?'Now':s.done?'Done':`Milestone ${i-1}`}</div>
              {s.done && <Icon.check/>}
            </div>
            <div className="px-num" style={{fontSize:36, fontWeight:700, letterSpacing:'-1px', marginTop:8, color:s.current?'#ff385c':'#222'}}>{s.w} kg</div>
            <div style={{fontSize:13, fontWeight:700, marginTop:4}}>{s.d}</div>
            <div className="px-meta-sm" style={{marginTop:8, lineHeight:1.4}}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebFood() {
  const tdeeVal = tdee({ weightKg: 107, heightCm: USER.heightCm, age: USER.age, sex: USER.sex, activityFactor: USER.activityFactor });
  const target = tdeeVal - 1100;
  const eaten = FOOD_TODAY.reduce((s,f)=>s+f.kcal,0);
  return (
    <>
      <div className="px-main-head">
        <div><div className="px-main-title">Food</div><div className="px-main-sub">{eaten} of {target} kcal · {target-eaten} remaining</div></div>
        <button className="px-btn is-primary"><Icon.plus/> Add food</button>
      </div>
      <div className="px-card" style={{padding:24}}>
        {FOOD_TODAY.map((it,i) => (
          <div key={it.id} style={{padding:'16px 0', borderTop: i===0?'none':'1px solid #ebebeb', display:'grid', gridTemplateColumns:'120px 1fr 80px 80px 80px 80px', alignItems:'center', gap:12}}>
            <div><div className="px-caption">{it.meal}</div><div className="px-meta-sm" style={{fontSize:11}}>{it.time}</div></div>
            <div style={{fontSize:15, fontWeight:600}}>{it.name}</div>
            <div className="px-num" style={{fontWeight:600}}>P {it.p}g</div>
            <div className="px-num" style={{fontWeight:600}}>C {it.c}g</div>
            <div className="px-num" style={{fontWeight:600}}>F {it.f}g</div>
            <div className="px-num" style={{fontWeight:700, fontSize:17, textAlign:'right'}}>{it.kcal}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function WebFast() {
  const fastStart = new Date(FASTING.startedAt);
  const now = new Date('2026-04-21T12:30');
  const hrs = (now-fastStart)/3600000;
  return (
    <>
      <div className="px-main-head"><div><div className="px-main-title">Fasting</div><div className="px-main-sub">16:8 today — {Math.floor(hrs)}h elapsed</div></div></div>
      <div className="px-card" style={{padding:48, textAlign:'center'}}>
        <div className="px-ring" style={{'--pct':(hrs/16)*100, '--col':'#6b21a8', '--sz':'240px', '--th':'16px', margin:'0 auto 24px'}}>
          <div className="px-ring-inner"><div className="px-num" style={{fontSize:44, fontWeight:700, letterSpacing:'-1px'}}>{Math.floor(hrs)}:{String(Math.floor((hrs%1)*60)).padStart(2,'0')}</div><div className="px-caption" style={{marginTop:6}}>of 16:00</div></div>
        </div>
        <div style={{display:'flex', gap:12, justifyContent:'center'}}>
          <button className="px-btn is-secondary">Edit start</button>
          <button className="px-btn is-primary">End fast</button>
        </div>
      </div>
    </>
  );
}

function WebExercise() {
  return (
    <>
      <div className="px-main-head"><div><div className="px-main-title">Exercise</div><div className="px-main-sub">Low-impact favoured · tennis 1×/wk</div></div><button className="px-btn is-primary"><Icon.plus/> Log activity</button></div>
      <div className="px-card" style={{padding:24}}>
        {EXERCISE_LOG.map((e,i) => (
          <div key={e.id} style={{padding:'14px 0', borderTop: i===0?'none':'1px solid #ebebeb', display:'grid', gridTemplateColumns:'120px 1fr 120px 100px 80px', alignItems:'center', gap:12}}>
            <div className="px-meta-sm">{fmtDate(e.date)}</div>
            <div style={{fontSize:15, fontWeight:600}}>{e.type}</div>
            <div className="px-meta">{e.minutes} min</div>
            <span className={`px-badge ${e.impact==='low'?'is-ok':'is-neutral'}`}>{e.impact} impact</span>
            <div className="px-num" style={{fontWeight:700, fontSize:17, textAlign:'right'}}>{e.kcal} kcal</div>
          </div>
        ))}
      </div>
    </>
  );
}

function WebPhotos() {
  return (
    <>
      <div className="px-main-head"><div><div className="px-main-title">Progress photos</div><div className="px-main-sub">Private — only you see these</div></div><button className="px-btn is-primary"><Icon.camera/> Add photo</button></div>
      <div className="px-card" style={{padding:24, marginBottom:20}}>
        <div className="px-title" style={{marginBottom:16}}>Before · Now compare</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          <PhotoTileBig label="1 Apr 2026" weight="109.4 kg"/>
          <PhotoTileBig label="21 Apr 2026" weight="107.0 kg" current/>
        </div>
      </div>
      <div className="px-card" style={{padding:24}}>
        <div className="px-title" style={{marginBottom:16}}>All photos</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12}}>
          {['1 Apr','8 Apr','15 Apr','21 Apr'].map((d,i) => <PhotoTile key={d} label={d} weight={['109.4','108.9','107.8','107.0'][i]+'kg'} current={i===3}/>)}
          <button style={{aspectRatio:'3/4', borderRadius:14, border:'1.5px dashed #dddddd', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', fontFamily:'inherit', color:'#6a6a6a'}}><Icon.plus/><div style={{fontSize:12, fontWeight:600}}>Add</div></button>
        </div>
      </div>
    </>
  );
}

function PhotoTileBig({ label, weight, current }) {
  return (
    <div style={{aspectRatio:'3/4', borderRadius:14, background:'linear-gradient(165deg,#f0efe9,#e3e0d6)', position:'relative', overflow:'hidden', border: current?'2px solid #ff385c':'1px solid #ebebeb'}}>
      <svg viewBox="0 0 60 80" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
        <circle cx="30" cy="18" r="8" fill="#c9c3b5"/>
        <path d="M14 80 Q14 40 30 40 Q46 40 46 80 Z" fill="#c9c3b5"/>
      </svg>
      <div style={{position:'absolute', bottom:16, left:16, right:16, color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,0.5)', display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:700}}>
        <span>{label}</span><span className="px-num">{weight}</span>
      </div>
    </div>
  );
}

Object.assign(window, { WebApp });
