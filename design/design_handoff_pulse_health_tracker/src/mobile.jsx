// Mobile app (single-file, screens switchable via bottom tab bar)
// Fits inside a 393x852-ish frame. Used on the design canvas.

function Screen({ children, style }) {
  return <div className="px-mob" style={style}>{children}</div>;
}

// -------- Dashboard --------
function MobileDashboard({ goto }) {
  const today = WEIGHT_LOG[WEIGHT_LOG.length-1];
  const lost = (USER.startWeight - today.kg).toFixed(1);
  const toGo = (today.kg - USER.goalWeight).toFixed(1);
  const bmiV = bmi(today.kg, USER.heightCm);
  const tdeeVal = tdee({ weightKg: today.kg, heightCm: USER.heightCm, age: USER.age, sex: USER.sex, activityFactor: USER.activityFactor });
  const targetKcal = tdeeVal - 1100;
  const eaten = FOOD_TODAY.reduce((s,f)=>s+f.kcal,0);
  const remaining = targetKcal - eaten;
  const macroP = FOOD_TODAY.reduce((s,f)=>s+f.p,0);
  const macroC = FOOD_TODAY.reduce((s,f)=>s+f.c,0);
  const macroF = FOOD_TODAY.reduce((s,f)=>s+f.f,0);

  // fasting hours so far
  const fastStart = new Date(FASTING.startedAt);
  const now = new Date('2026-04-21T12:30');
  const fastHrs = ((now - fastStart) / 3600000);
  const fastPct = Math.min(100, (fastHrs / FASTING.goalHours) * 100);

  const { weeks, end } = projectTimeline({ startWeight: USER.startWeight, goalWeight: USER.goalWeight, kgPerWeek: 1.0, startDate: USER.startDate });

  return (
    <Screen>
      <div className="px-mob-head">
        <div>
          <div className="px-meta-sm">Tuesday · 21 Apr</div>
          <div style={{fontSize:24, fontWeight:700, letterSpacing:'-0.44px', marginTop:2}}>Hi, Goran</div>
        </div>
        <div style={{width:40, height:40, borderRadius:999, background:'#222', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14}}>GB</div>
      </div>
      <div className="px-mob-body">
        {/* Hero weight card */}
        <div className="px-card" style={{padding:20, marginBottom:16}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
            <div>
              <div className="px-caption">Today</div>
              <div style={{display:'flex', alignItems:'baseline', gap:4, marginTop:6}}>
                <span className="px-num" style={{fontSize:52, fontWeight:700, letterSpacing:'-1.4px', lineHeight:1}}>{today.kg}</span>
                <span style={{fontSize:16, color:'#6a6a6a', fontWeight:600}}>kg</span>
              </div>
              <div style={{display:'flex', gap:8, marginTop:10, alignItems:'center'}}>
                <span className="px-badge is-ok"><Icon.arrowDown width="10" height="10"/> −{lost} kg</span>
                <span className="px-meta-sm">since 1 Apr</span>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="px-caption">BMI</div>
              <div className="px-num" style={{fontSize:22, fontWeight:700, letterSpacing:'-0.44px', marginTop:4}}>{bmiV.toFixed(1)}</div>
              <div style={{fontSize:11, color:'#f59e0b', fontWeight:700, marginTop:2}}>{bmiClass(bmiV).label}</div>
            </div>
          </div>
          <div style={{marginTop:16}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:600, marginBottom:6}}>
              <span className="px-meta-sm">107.0 kg</span>
              <span className="px-meta-sm">Goal · 79.0 kg</span>
            </div>
            <div className="px-bar is-accent"><i style={{width: `${((USER.startWeight - today.kg)/(USER.startWeight - USER.goalWeight))*100}%`}}/></div>
            <div className="px-meta-sm" style={{marginTop:8}}>{toGo} kg to goal · projected <b style={{color:'#222'}}>{fmtDateShort(end)}</b> at 1.0 kg/wk</div>
          </div>
        </div>

        {/* Today's rings row */}
        <div className="px-card" style={{padding:16, marginBottom:16}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:12}}>
            <div className="px-title-sm">Today</div>
            <div className="px-meta-sm px-num">{eaten}/{targetKcal} kcal</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12}}>
            <RingStat pct={(eaten/targetKcal)*100} col="#b45309" label="Eaten" value={`${eaten}`} unit="kcal" onClick={()=>goto('food')}/>
            <RingStat pct={fastPct} col="#6b21a8" label="Fasting" value={`${Math.floor(fastHrs)}h ${Math.round((fastHrs%1)*60)}m`} unit={`of ${FASTING.goalHours}h`} onClick={()=>goto('fast')}/>
            <RingStat pct={(EXERCISE_LOG[0].kcal / 400)*100} col="#0f766e" label="Move" value={`${EXERCISE_LOG[0].kcal}`} unit="kcal" onClick={()=>goto('exercise')}/>
          </div>
          <hr className="px-hr"/>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10}}>
            <MacroBar label="Protein" value={macroP} target={160} color="#be123c"/>
            <MacroBar label="Carbs" value={macroC} target={160} color="#b45309"/>
            <MacroBar label="Fat" value={macroF} target={55} color="#6b21a8"/>
          </div>
        </div>

        {/* Net calories */}
        <div className="px-card" style={{padding:16, marginBottom:16}}>
          <div className="px-title-sm" style={{marginBottom:10}}>Energy balance</div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="px-meta-sm">Eaten − burned</div>
              <div className="px-num" style={{fontSize:28, fontWeight:700, letterSpacing:'-0.6px'}}>{eaten - EXERCISE_LOG[0].kcal}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="px-meta-sm">Target (deficit)</div>
              <div className="px-num" style={{fontSize:20, fontWeight:600}}>≤ {targetKcal}</div>
            </div>
          </div>
          <div style={{marginTop:10, background:'#fff0f3', padding:'10px 12px', borderRadius:10, fontSize:12, color:'#be123c', fontWeight:600, display:'flex', gap:8, alignItems:'center'}}>
            <Icon.flame width="14" height="14"/> Deficit of ~{tdeeVal - (eaten - EXERCISE_LOG[0].kcal)} kcal so far — on pace
          </div>
        </div>

        {/* Quick log */}
        <div className="px-title-sm" style={{margin:'8px 4px 10px'}}>Quick log</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16}}>
          <QuickTile icon={<Icon.scale/>} label="Weight" sub="Last: 107.0 kg" onClick={()=>goto('weight')}/>
          <QuickTile icon={<Icon.food/>} label="Food" sub={`${eaten} kcal today`} onClick={()=>goto('food')}/>
          <QuickTile icon={<Icon.clock/>} label="Fasting" sub={`${Math.floor(fastHrs)}h · 16:8`} onClick={()=>goto('fast')}/>
          <QuickTile icon={<Icon.run/>} label="Exercise" sub="Walk · 35 min" onClick={()=>goto('exercise')}/>
        </div>

        <div className="px-title-sm" style={{margin:'8px 4px 10px'}}>Next milestone</div>
        <div className="px-card lift" onClick={()=>goto('roadmap')} style={{padding:16, marginBottom:24, cursor:'pointer'}}>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <div style={{width:56, height:56, borderRadius:14, background:'linear-gradient(180deg,#fde0e4,#f4b3bc)', display:'flex', alignItems:'center', justifyContent:'center', color:'#be123c'}}>
              <Icon.trophy width="24" height="24"/>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:15, fontWeight:600, letterSpacing:'-0.3px'}}>100 kg — first 7 kg down</div>
              <div className="px-meta-sm" style={{marginTop:2}}>~ 7 weeks · mid June</div>
            </div>
            <Icon.chevronR/>
          </div>
        </div>
      </div>

      <MobileTabBar active="home" goto={goto}/>
    </Screen>
  );
}

function RingStat({ pct, col, label, value, unit, onClick }) {
  return (
    <button onClick={onClick} style={{background:'transparent', border:0, padding:0, textAlign:'center', cursor:'pointer', fontFamily:'inherit'}}>
      <div className="px-ring" style={{'--pct':pct, '--col':col, '--sz':'76px', '--th':'7px', margin:'0 auto'}}>
        <div className="px-ring-inner">
          <div className="px-num" style={{fontSize:13, fontWeight:700, letterSpacing:'-0.2px'}}>{value}</div>
          <div style={{fontSize:9, color:'#6a6a6a', fontWeight:600, marginTop:1}}>{unit}</div>
        </div>
      </div>
      <div className="px-caption" style={{marginTop:8}}>{label}</div>
    </button>
  );
}

function QuickTile({ icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} className="px-card lift" style={{padding:14, border:0, textAlign:'left', cursor:'pointer', fontFamily:'inherit', display:'flex', gap:12, alignItems:'center'}}>
      <div style={{width:40, height:40, borderRadius:10, background:'#f7f7f7', display:'flex', alignItems:'center', justifyContent:'center', color:'#222', flexShrink:0}}>{icon}</div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:14, fontWeight:600, letterSpacing:'-0.2px'}}>{label}</div>
        <div className="px-meta-sm" style={{marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{sub}</div>
      </div>
    </button>
  );
}

// -------- Weight log --------
function MobileWeight({ goto }) {
  const today = WEIGHT_LOG[WEIGHT_LOG.length-1];
  const { end } = projectTimeline({ startWeight: USER.startWeight, goalWeight: USER.goalWeight, kgPerWeek: 1.0, startDate: USER.startDate });
  return (
    <Screen>
      <div className="px-mob-head">
        <button className="px-btn is-ghost is-sm" onClick={()=>goto('home')} style={{padding:'6px 10px'}}>‹ Back</button>
        <div style={{fontSize:16, fontWeight:700}}>Weight</div>
        <button className="px-btn is-ghost is-sm" style={{padding:'6px 10px'}}>···</button>
      </div>
      <div className="px-mob-body">
        <div className="px-card" style={{padding:20, marginBottom:16}}>
          <div className="px-caption">Today · 21 Apr</div>
          <div style={{display:'flex', alignItems:'baseline', gap:4, marginTop:4}}>
            <span className="px-num" style={{fontSize:56, fontWeight:700, letterSpacing:'-1.4px', lineHeight:1}}>{today.kg}</span>
            <span style={{fontSize:18, color:'#6a6a6a', fontWeight:600}}>kg</span>
          </div>
          <div style={{display:'flex', gap:12, marginTop:14}}>
            <button className="px-btn is-primary" style={{flex:1}}><Icon.plus/> Log weight</button>
            <button className="px-btn is-secondary"><Icon.camera/></button>
          </div>
        </div>

        <div className="px-card" style={{padding:16, marginBottom:16}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8}}>
            <div className="px-title-sm">Trend → Goal</div>
            <div className="px-chips" style={{gap:6}}>
              <span className="px-pill is-sel" style={{padding:'4px 10px', fontSize:11}}>All</span>
              <span className="px-pill" style={{padding:'4px 10px', fontSize:11}}>1M</span>
              <span className="px-pill" style={{padding:'4px 10px', fontSize:11}}>3M</span>
            </div>
          </div>
          <WeightTrendChart log={WEIGHT_LOG} startWeight={USER.startWeight} goalWeight={USER.goalWeight}
            goalDate={end} kgPerWeek={1.0} today="2026-04-21" width={340} height={200}/>
        </div>

        <div className="px-card" style={{padding:16, marginBottom:16}}>
          <div className="px-title-sm" style={{marginBottom:10}}>History</div>
          {WEIGHT_LOG.slice().reverse().map((row, i) => {
            const prev = WEIGHT_LOG[WEIGHT_LOG.length - 1 - i - 1];
            const delta = prev ? (row.kg - prev.kg) : 0;
            return (
              <div key={row.date} style={{display:'flex', padding:'12px 0', borderTop: i===0?'none':'1px solid #ebebeb', alignItems:'center'}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14, fontWeight:600}}>{fmtDateShort(row.date)}</div>
                  <div className="px-meta-sm">{i===0 ? 'Today' : `${i*2} days ago`}</div>
                </div>
                <div className="px-num" style={{fontSize:18, fontWeight:700, letterSpacing:'-0.3px', marginRight:12}}>{row.kg} kg</div>
                {prev && (
                  <span className={`px-badge ${delta < 0 ? 'is-ok' : delta > 0 ? 'is-bad' : 'is-neutral'}`} style={{minWidth:50, justifyContent:'center'}}>
                    {delta < 0 ? '▼' : delta > 0 ? '▲' : '—'} {Math.abs(delta).toFixed(1)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <MobileTabBar active="weight" goto={goto}/>
    </Screen>
  );
}

// -------- Food log --------
function MobileFood({ goto }) {
  const tdeeVal = tdee({ weightKg: 107, heightCm: USER.heightCm, age: USER.age, sex: USER.sex, activityFactor: USER.activityFactor });
  const target = tdeeVal - 1100;
  const eaten = FOOD_TODAY.reduce((s,f)=>s+f.kcal,0);
  const left = target - eaten;
  const byMeal = {};
  FOOD_TODAY.forEach(f => { byMeal[f.meal] = byMeal[f.meal] || []; byMeal[f.meal].push(f); });
  const mealsOrder = ['Breakfast','Lunch','Snack','Dinner'];
  return (
    <Screen>
      <div className="px-mob-head">
        <button className="px-btn is-ghost is-sm" onClick={()=>goto('home')}>‹ Back</button>
        <div style={{fontSize:16, fontWeight:700}}>Food</div>
        <button className="px-btn is-ghost is-sm">···</button>
      </div>
      <div className="px-mob-body">
        <div className="px-card" style={{padding:20, marginBottom:16}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="px-caption">Remaining</div>
              <div style={{display:'flex', alignItems:'baseline', gap:4, marginTop:4}}>
                <span className="px-num" style={{fontSize:44, fontWeight:700, letterSpacing:'-1.2px', lineHeight:1}}>{left}</span>
                <span style={{fontSize:14, color:'#6a6a6a', fontWeight:600}}>kcal</span>
              </div>
              <div className="px-meta-sm" style={{marginTop:6}}>{eaten} of {target} target</div>
            </div>
            <div className="px-ring" style={{'--pct':(eaten/target)*100, '--col':'#b45309', '--sz':'92px', '--th':'9px'}}>
              <div className="px-ring-inner">
                <div className="px-num" style={{fontSize:16, fontWeight:700}}>{Math.round((eaten/target)*100)}%</div>
              </div>
            </div>
          </div>
          <hr className="px-hr"/>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
            <MacroBar label="Protein" value={FOOD_TODAY.reduce((s,f)=>s+f.p,0)} target={160} color="#be123c"/>
            <MacroBar label="Carbs" value={FOOD_TODAY.reduce((s,f)=>s+f.c,0)} target={160} color="#b45309"/>
            <MacroBar label="Fat" value={FOOD_TODAY.reduce((s,f)=>s+f.f,0)} target={55} color="#6b21a8"/>
          </div>
        </div>

        {mealsOrder.map(meal => {
          const items = byMeal[meal] || [];
          const mealCals = items.reduce((s,f)=>s+f.kcal,0);
          return (
            <div key={meal} className="px-card" style={{padding:16, marginBottom:12}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <div className="px-title-sm">{meal}</div>
                <div className="px-meta-sm px-num">{mealCals} kcal</div>
              </div>
              {items.length === 0 ? (
                <button className="px-btn is-secondary" style={{width:'100%', marginTop:12, justifyContent:'flex-start'}}><Icon.plus/> Add {meal.toLowerCase()}</button>
              ) : (
                <div style={{marginTop:10}}>
                  {items.map(it => (
                    <div key={it.id} style={{padding:'10px 0', borderTop:'1px solid #ebebeb', display:'flex', alignItems:'center', gap:10}}>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize:14, fontWeight:600, letterSpacing:'-0.2px'}}>{it.name}</div>
                        <div className="px-meta-sm" style={{marginTop:1}}>P {it.p}g · C {it.c}g · F {it.f}g</div>
                      </div>
                      <div className="px-num" style={{fontWeight:600, fontSize:14}}>{it.kcal}</div>
                    </div>
                  ))}
                  <button className="px-btn is-ghost is-sm" style={{marginTop:8, padding:'6px 0', color:'#ff385c'}}><Icon.plus/> Add more</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <MobileTabBar active="food" goto={goto}/>
    </Screen>
  );
}

// -------- Fasting --------
function MobileFast({ goto }) {
  const fastStart = new Date(FASTING.startedAt);
  const now = new Date('2026-04-21T12:30');
  const hrs = (now - fastStart)/3600000;
  const pct = Math.min(100, (hrs/FASTING.goalHours)*100);
  const endsAt = new Date(fastStart.getTime() + FASTING.goalHours*3600000);
  return (
    <Screen>
      <div className="px-mob-head">
        <button className="px-btn is-ghost is-sm" onClick={()=>goto('home')}>‹ Back</button>
        <div style={{fontSize:16, fontWeight:700}}>Fasting</div>
        <button className="px-btn is-ghost is-sm">···</button>
      </div>
      <div className="px-mob-body">
        <div className="px-card" style={{padding:24, marginBottom:16, textAlign:'center'}}>
          <div className="px-caption" style={{color:'#6b21a8'}}>Active · 16:8</div>
          <div className="px-ring" style={{'--pct':pct, '--col':'#6b21a8', '--sz':'200px', '--th':'14px', margin:'20px auto 16px'}}>
            <div className="px-ring-inner">
              <div className="px-num" style={{fontSize:36, fontWeight:700, letterSpacing:'-0.8px'}}>{Math.floor(hrs)}:{String(Math.floor((hrs%1)*60)).padStart(2,'0')}</div>
              <div className="px-caption" style={{marginTop:4}}>elapsed</div>
            </div>
          </div>
          <div style={{display:'flex', justifyContent:'space-around', marginBottom:16}}>
            <div>
              <div className="px-caption">Started</div>
              <div style={{fontSize:14, fontWeight:600, marginTop:4}}>{fastStart.toLocaleTimeString('en-AU', {hour:'2-digit', minute:'2-digit'})}</div>
              <div className="px-meta-sm">Yesterday</div>
            </div>
            <div style={{width:1, background:'#ebebeb'}}/>
            <div>
              <div className="px-caption">Ends</div>
              <div style={{fontSize:14, fontWeight:600, marginTop:4, color:'#ff385c'}}>{endsAt.toLocaleTimeString('en-AU', {hour:'2-digit', minute:'2-digit'})}</div>
              <div className="px-meta-sm">in {Math.round(FASTING.goalHours - hrs)}h</div>
            </div>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button className="px-btn is-secondary" style={{flex:1}}>Edit start</button>
            <button className="px-btn is-primary" style={{flex:1}}>End fast</button>
          </div>
        </div>

        <div className="px-title-sm" style={{margin:'12px 4px 10px'}}>Today's plan</div>
        <div className="px-card" style={{padding:14, marginBottom:16}}>
          <div style={{display:'flex', gap:6}}>
            {['16:8','18:6','OMAD','14:10','Off'].map((p,i)=>(
              <span key={p} className={`px-pill ${i===0?'is-sel':''}`} style={{fontSize:11}}>{p}</span>
            ))}
          </div>
          <div className="px-meta-sm" style={{marginTop:10}}>Tap a plan to switch for today. History won't be affected.</div>
        </div>

        <div className="px-title-sm" style={{margin:'12px 4px 10px'}}>This week</div>
        <div className="px-card" style={{padding:16}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6}}>
            {['M','T','W','T','F','S','S'].map((d,i) => {
              const h = [16, 17, 15, 16, 0, 18, 14][i];
              return (
                <div key={i} style={{textAlign:'center'}}>
                  <div className="px-caption" style={{marginBottom:6}}>{d}</div>
                  <div style={{height:60, background:'#f7f7f7', borderRadius:8, position:'relative', overflow:'hidden'}}>
                    <div style={{position:'absolute', bottom:0, left:0, right:0, height:`${(h/20)*100}%`, background: i===4?'#ebebeb':'#6b21a8', borderRadius:8}}/>
                  </div>
                  <div className="px-num" style={{fontSize:11, fontWeight:600, marginTop:4}}>{h ? h+'h' : '—'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <MobileTabBar active="fast" goto={goto}/>
    </Screen>
  );
}

// -------- Exercise --------
function MobileExercise({ goto }) {
  const totalWeek = EXERCISE_LOG.reduce((s,e)=>s+e.kcal, 0);
  const totalMin = EXERCISE_LOG.reduce((s,e)=>s+e.minutes, 0);
  return (
    <Screen>
      <div className="px-mob-head">
        <button className="px-btn is-ghost is-sm" onClick={()=>goto('home')}>‹ Back</button>
        <div style={{fontSize:16, fontWeight:700}}>Exercise</div>
        <button className="px-btn is-ghost is-sm">···</button>
      </div>
      <div className="px-mob-body">
        <div className="px-card" style={{padding:20, marginBottom:16}}>
          <div className="px-caption">This week</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:10}}>
            <div>
              <div className="px-num" style={{fontSize:32, fontWeight:700, letterSpacing:'-0.8px'}}>{totalWeek}</div>
              <div className="px-meta-sm">kcal burned</div>
            </div>
            <div>
              <div className="px-num" style={{fontSize:32, fontWeight:700, letterSpacing:'-0.8px'}}>{Math.floor(totalMin/60)}h {totalMin%60}m</div>
              <div className="px-meta-sm">moving time</div>
            </div>
          </div>
          <div style={{marginTop:14, background:'#e7f5ec', padding:'10px 12px', borderRadius:10, fontSize:12, color:'#0f5132', fontWeight:600, display:'flex', gap:8, alignItems:'center'}}>
            <Icon.check/> Low-impact favoured — easy on the knees
          </div>
        </div>

        <div className="px-title-sm" style={{margin:'12px 4px 10px'}}>Quick log</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, marginBottom:16}}>
          {[
            {n:'Walk', ok:true},
            {n:'Tennis', ok:true},
            {n:'Swim', ok:true},
            {n:'Bike', ok:true},
            {n:'Stretch', ok:true},
            {n:'Run', ok:false},
            {n:'Soccer', ok:false},
            {n:'More…', ok:true},
          ].map(s => (
            <button key={s.n} className="px-card" style={{padding:'12px 4px', border:0, background:s.ok?'#fff':'#f7f7f7', opacity:s.ok?1:0.55, textAlign:'center', fontFamily:'inherit', cursor:s.ok?'pointer':'not-allowed', fontSize:12, fontWeight:600, position:'relative'}}>
              {s.n}
              {!s.ok && <div style={{fontSize:9, color:'#6a6a6a', fontWeight:500, marginTop:2}}>flagged</div>}
            </button>
          ))}
        </div>

        <div className="px-title-sm" style={{margin:'12px 4px 10px'}}>Recent</div>
        {EXERCISE_LOG.map(e => (
          <div key={e.id} className="px-card" style={{padding:14, marginBottom:8, display:'flex', gap:12, alignItems:'center'}}>
            <div style={{width:44, height:44, borderRadius:12, background:'linear-gradient(180deg,#d3f2ee,#a8e0d5)', color:'#0f766e', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <Icon.run/>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:14, fontWeight:600, letterSpacing:'-0.2px'}}>{e.type}</div>
              <div className="px-meta-sm">{fmtDateShort(e.date)} · {e.minutes} min</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="px-num" style={{fontSize:15, fontWeight:700, letterSpacing:'-0.2px'}}>{e.kcal}</div>
              <div className="px-meta-sm" style={{fontSize:10}}>kcal</div>
            </div>
          </div>
        ))}
      </div>
      <MobileTabBar active="exercise" goto={goto}/>
    </Screen>
  );
}

// -------- Roadmap --------
function MobileRoadmap({ goto, variant='timeline' }) {
  const [pace, setPace] = React.useState(1.0);
  const { weeks, end } = projectTimeline({ startWeight: USER.startWeight, goalWeight: USER.goalWeight, kgPerWeek: pace, startDate: USER.startDate });
  const ms = buildMilestones(USER.startWeight, USER.goalWeight, pace, USER.startDate);
  const today = WEIGHT_LOG[WEIGHT_LOG.length-1];

  return (
    <Screen>
      <div className="px-mob-head">
        <button className="px-btn is-ghost is-sm" onClick={()=>goto('home')}>‹ Back</button>
        <div style={{fontSize:16, fontWeight:700}}>Roadmap</div>
        <button className="px-btn is-ghost is-sm">···</button>
      </div>
      <div className="px-mob-body">
        <div className="px-card" style={{padding:20, marginBottom:16, background:'linear-gradient(180deg,#fff,#fff0f3)'}}>
          <div className="px-caption">Projected arrival at 79 kg</div>
          <div className="px-num" style={{fontSize:40, fontWeight:700, letterSpacing:'-1.2px', marginTop:4, color:'#ff385c'}}>{fmtDateShort(end)}</div>
          <div className="px-meta-sm" style={{marginTop:4}}>{weeks} weeks from today at {pace.toFixed(2)} kg/wk</div>

          <div style={{marginTop:16}}>
            <div className="px-caption" style={{marginBottom:8}}>Safe weekly loss pace</div>
            <div style={{display:'flex', gap:6}}>
              {[0.5, 0.75, 1.0].map(v => (
                <button key={v} onClick={()=>setPace(v)} className={`px-pill ${pace===v?'is-sel':''}`} style={{flex:1, justifyContent:'center', fontSize:12}}>
                  {v.toFixed(2)} kg/wk
                </button>
              ))}
            </div>
            <div className="px-meta-sm" style={{marginTop:8, fontSize:11}}>0.5–1.0 kg/wk is the medically-safe range. Above = muscle + rebound risk.</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-card" style={{padding:18, marginBottom:16}}>
          <div className="px-title-sm" style={{marginBottom:16}}>Milestones</div>
          <div style={{position:'relative', paddingLeft:28}}>
            <div style={{position:'absolute', left:10, top:8, bottom:8, width:2, background:'#ebebeb'}}/>
            <TimelineNode dot="start" label="Start" date="1 Apr 2026" weight="109.4 kg" sub="Baseline" done/>
            <TimelineNode dot="now" label="Today" date="21 Apr 2026" weight={`${today.kg} kg`} sub={`−${(USER.startWeight-today.kg).toFixed(1)} kg in 3 wks`} current/>
            {ms.map((m,i) => (
              <TimelineNode key={m.i} dot="ms" label={`Milestone ${m.i}`} date={fmtDateShort(m.date)} weight={`${m.weightKg} kg`} sub={m.label}/>
            ))}
          </div>
        </div>

        <div className="px-card" style={{padding:16, marginBottom:16}}>
          <div className="px-title-sm" style={{marginBottom:10}}>What keeps you on pace</div>
          {[
            { l:'Calorie deficit', v:'~1,100 kcal/day', ok:true },
            { l:'Protein intake', v:'≥ 140 g/day (muscle retention)', ok:true },
            { l:'Fasting 16:8', v:'5 days/wk', ok:true },
            { l:'Low-impact cardio', v:'3×/wk · 30–40 min', ok:true },
            { l:'Tennis', v:'1×/wk singles', ok:true },
          ].map(x => (
            <div key={x.l} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderTop:'1px solid #ebebeb'}}>
              <div style={{width:20, height:20, borderRadius:999, background:'#e7f5ec', color:'#16a34a', display:'flex', alignItems:'center', justifyContent:'center'}}><Icon.check/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:13, fontWeight:600}}>{x.l}</div>
                <div className="px-meta-sm" style={{fontSize:11}}>{x.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MobileTabBar active="roadmap" goto={goto}/>
    </Screen>
  );
}

function TimelineNode({ dot, label, date, weight, sub, done, current }) {
  const dotStyle = current
    ? { background:'#ff385c', boxShadow:'0 0 0 4px #fff, 0 0 0 6px #ff385c' }
    : done
    ? { background:'#222' }
    : { background:'#fff', border:'2px solid #dddddd' };
  return (
    <div style={{position:'relative', paddingBottom:18}}>
      <div style={{position:'absolute', left:-24, top:4, width:14, height:14, borderRadius:999, ...dotStyle}}/>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <div style={{fontSize:14, fontWeight:700, letterSpacing:'-0.2px', color:current?'#ff385c':'#222'}}>{label}</div>
        <div className="px-num" style={{fontSize:15, fontWeight:700}}>{weight}</div>
      </div>
      <div className="px-meta-sm" style={{fontSize:12}}>{date} · {sub}</div>
    </div>
  );
}

// -------- Photos --------
function MobilePhotos({ goto }) {
  return (
    <Screen>
      <div className="px-mob-head">
        <button className="px-btn is-ghost is-sm" onClick={()=>goto('home')}>‹ Back</button>
        <div style={{fontSize:16, fontWeight:700}}>Progress</div>
        <button className="px-btn is-ghost is-sm">···</button>
      </div>
      <div className="px-mob-body">
        <div className="px-card" style={{padding:16, marginBottom:16}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div className="px-title-sm">Before / Now</div>
            <span className="px-badge is-neutral">Private</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:12}}>
            <PhotoTile label="1 Apr" weight="109.4 kg"/>
            <PhotoTile label="21 Apr" weight="107.0 kg" current/>
          </div>
          <button className="px-btn is-secondary" style={{width:'100%', marginTop:12}}>Open compare slider</button>
        </div>

        <div className="px-title-sm" style={{margin:'12px 4px 10px'}}>All progress photos</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
          {[
            {d:'1 Apr', w:'109.4'},
            {d:'8 Apr', w:'108.9'},
            {d:'15 Apr', w:'107.8'},
            {d:'21 Apr', w:'107.0'},
          ].map(p => <PhotoTile key={p.d} label={p.d} weight={`${p.w}kg`} small/>)}
          <button style={{aspectRatio:'3/4', borderRadius:12, border:'1.5px dashed #dddddd', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer', fontFamily:'inherit', color:'#6a6a6a'}}>
            <Icon.plus width="20" height="20"/>
            <div style={{fontSize:11, fontWeight:600}}>Add</div>
          </button>
        </div>
      </div>
      <MobileTabBar active="photos" goto={goto}/>
    </Screen>
  );
}

function PhotoTile({ label, weight, current, small }) {
  return (
    <div style={{aspectRatio:'3/4', borderRadius:small?10:14, background:'linear-gradient(165deg,#f0efe9,#e3e0d6)', position:'relative', overflow:'hidden', border: current?'2px solid #ff385c':'1px solid #ebebeb'}}>
      <svg viewBox="0 0 60 80" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
        <circle cx="30" cy="18" r="8" fill="#c9c3b5"/>
        <path d="M14 80 Q14 40 30 40 Q46 40 46 80 Z" fill="#c9c3b5"/>
      </svg>
      <div style={{position:'absolute', bottom:6, left:8, right:8, color:'#fff', textShadow:'0 1px 2px rgba(0,0,0,0.4)', display:'flex', justifyContent:'space-between', fontSize:small?9:11, fontWeight:700}}>
        <span>{label}</span><span className="px-num">{weight}</span>
      </div>
    </div>
  );
}

// -------- Tab bar --------
function MobileTabBar({ active, goto }) {
  const tabs = [
    { k:'home', icon: Icon.home, label:'Home' },
    { k:'weight', icon: Icon.scale, label:'Weight' },
    { k:'food', icon: Icon.food, label:'Food' },
    { k:'exercise', icon: Icon.run, label:'Move' },
    { k:'roadmap', icon: Icon.map, label:'Roadmap' },
  ];
  return (
    <div className="px-mob-tabbar">
      {tabs.map(t => (
        <button key={t.k} className={`px-tab ${active===t.k?'is-active':''}`} onClick={()=>goto(t.k)}>
          <t.icon/>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// -------- Mobile app shell --------
function MobileApp({ initial='home', variant }) {
  const [screen, setScreen] = React.useState(initial);
  const goto = setScreen;
  const common = { goto };
  if (screen === 'weight')   return <MobileWeight {...common}/>;
  if (screen === 'food')     return <MobileFood {...common}/>;
  if (screen === 'fast')     return <MobileFast {...common}/>;
  if (screen === 'exercise') return <MobileExercise {...common}/>;
  if (screen === 'roadmap')  return <MobileRoadmap {...common} variant={variant}/>;
  if (screen === 'photos')   return <MobilePhotos {...common}/>;
  return <MobileDashboard {...common}/>;
}

Object.assign(window, {
  MobileApp, MobileDashboard, MobileWeight, MobileFood, MobileFast, MobileExercise, MobileRoadmap, MobilePhotos, MobileTabBar,
});
