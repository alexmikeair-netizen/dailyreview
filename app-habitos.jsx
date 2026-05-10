// Vista HÁBITOS — Rutina diaria, Tracker semanal, Nutrición, Deporte
const { useState: useStateH, useMemo: useMemoH } = React;

function HabitosView({ state, setModule, setHabitsConfig }) {
  const [tab, setTab] = useStateH('rutina');
  return (
    <div className="habitos-view-wrap">
      <div className="reprog-head">
        <div className="modulo-eyebrow">HÁBITOS · DISCIPLINA DIARIA</div>
        <h1 className="view-title">La identidad se construye con repetición</h1>
        <p className="view-sub">"Los hábitos son la nueva moralidad: lo que repites cada día es quien te haces."</p>
      </div>

      <div className="sub-tabs reprog-tabs">
        <button className={`sub-tab ${tab==='rutina'?'active':''}`} onClick={()=>setTab('rutina')}>Rutina diaria</button>
        <button className={`sub-tab ${tab==='tracker'?'active':''}`} onClick={()=>setTab('tracker')}>Tracker semanal</button>
        <button className={`sub-tab ${tab==='nutri'?'active':''}`} onClick={()=>setTab('nutri')}>Nutrición</button>
        <button className={`sub-tab ${tab==='deporte'?'active':''}`} onClick={()=>setTab('deporte')}>Deporte</button>
      </div>

      {tab==='rutina' && <RutinaView state={state} setModule={setModule}/>}
      {tab==='tracker' && <TrackerView state={state} setModule={setModule}/>}
      {tab==='nutri' && <NutriView state={state} setModule={setModule}/>}
      {tab==='deporte' && <DeporteView/>}
    </div>
  );
}

const CAT_INFO = {
  spirit: { color: '#7F77DD', icon: '✝️', name: 'Espíritu' },
  body:   { color: '#1D9E75', icon: '🏋', name: 'Cuerpo' },
  study:  { color: '#BA7517', icon: '📖', name: 'Estudio' },
  work:   { color: '#378ADD', icon: '⚙', name: 'Negocio' },
  content:{ color: '#D85A30', icon: '🎬', name: 'Contenido' },
  rest:   { color: '#888780', icon: '🌙', name: 'Descanso' },
};

function RutinaView({ state, setModule }) {
  const key = window.todayKey();
  const data = state.modules?.[key]?.rutina || {};
  const toggle = (time) => {
    const next = { ...data, [time]: !data[time] };
    setModule(key, 'rutina', next);
  };
  const total = window.RUTINA_DIARIA.length;
  const done = window.RUTINA_DIARIA.filter(b => data[b.time]).length;
  const pct = Math.round((done/total)*100);

  return (
    <div className="rutina-view">
      <div className="rutina-progress">
        <div className="rp-track"><div className="rp-fill" style={{width:`${pct}%`}}/></div>
        <div className="rp-text">{done}/{total} bloques · {pct}%</div>
      </div>

      <div className="rutina-list">
        {window.RUTINA_DIARIA.map(b => {
          const info = CAT_INFO[b.cat];
          const checked = !!data[b.time];
          return (
            <button key={b.time}
              className={`rutina-block ${checked?'done':''}`}
              style={{'--rb-color': info.color}}
              onClick={()=>toggle(b.time)}>
              <div className="rb-time">{b.time}</div>
              <div className="rb-icon">{info.icon}</div>
              <div className="rb-body">
                <div className="rb-title">{b.title}</div>
                <div className="rb-desc">{b.desc}</div>
              </div>
              <div className={`rb-check ${checked?'on':''}`}>{checked?'✓':''}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TrackerView({ state, setModule }) {
  const days = window.lastSevenDays();
  const groups = window.HABITOS_GROUPS;
  const [openG, setOpenG] = useStateH(groups[0].name);
  const todayK = window.todayKey();
  const todayData = state.modules?.[todayK]?.habitos || {};
  const toggle = (id) => {
    const next = { ...todayData, [id]: !todayData[id] };
    setModule(todayK, 'habitos', next);
  };

  const totals = useMemoH(() => {
    return groups.map(g => {
      let tot = 0, hit = 0;
      g.items.forEach(it => {
        days.forEach(d => {
          tot++;
          const k = window.dateKey(d);
          if (state.modules?.[k]?.habitos?.[it.id]) hit++;
        });
      });
      return { group: g.name, color: g.color, hit, tot, pct: tot ? Math.round(hit/tot*100) : 0 };
    });
  }, [state, days]);

  return (
    <div className="tracker-view">
      <div className="tracker-summary">
        {totals.map(t => (
          <div key={t.group} className="ts-card" style={{'--ts-color': t.color}}>
            <div className="ts-name">{t.group}</div>
            <div className="ts-pct">{t.pct}%</div>
            <div className="ts-meta">{t.hit}/{t.tot} esta semana</div>
            <div className="ts-bar"><div className="ts-fill" style={{width:`${t.pct}%`}}/></div>
          </div>
        ))}
      </div>

      <h3 className="tracker-h">Hoy — marca los hábitos cumplidos</h3>
      <div className="tracker-groups">
        {groups.map(g => (
          <div key={g.name} className={`tg-block ${openG===g.name?'open':''}`} style={{'--tg-color': g.color}}>
            <button className="tg-head" onClick={()=>setOpenG(openG===g.name?null:g.name)}>
              <span className="tg-dot"/>
              <span className="tg-name">{g.name}</span>
              <span className="tg-count">{g.items.filter(i=>todayData[i.id]).length}/{g.items.length}</span>
              <span className="tg-toggle">{openG===g.name?'−':'+'}</span>
            </button>
            {openG===g.name && (
              <div className="tg-items">
                {g.items.map(it => (
                  <button key={it.id} className={`tg-it ${todayData[it.id]?'on':''}`} onClick={()=>toggle(it.id)}>
                    <span className="tg-it-check">{todayData[it.id]?'✓':''}</span>
                    <span>{it.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="tracker-h">Tu semana</h3>
      <div className="tracker-week">
        <table className="habitos-table">
          <thead>
            <tr>
              <th></th>
              {days.map(d => <th key={d.toISOString()}>{window.dayName(d)}<br/><span className="hd-num">{d.getDate()}</span></th>)}
            </tr>
          </thead>
          <tbody>
            {groups.map(g => g.items.map(it => (
              <tr key={it.id}>
                <td className="hb-label" style={{borderLeft:`3px solid ${g.color}`}}>{it.text}</td>
                {days.map(d => {
                  const k = window.dateKey(d);
                  const done = state.modules?.[k]?.habitos?.[it.id];
                  return <td key={k} className={`hb-cell ${done?'done':''}`}>{done?'●':'○'}</td>;
                })}
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NutriView({ state, setModule }) {
  const n = window.NUTRICION;
  const key = window.todayKey();
  const data = state.modules?.[key]?.nutri || {};
  const set = (k, v) => setModule(key, 'nutri', { ...data, [k]: v });

  const meals = [
    { id: 'batido', emoji: '🥤', m: n.batido },
    { id: 'comida', emoji: '🍽', m: n.comida },
    { id: 'cena', emoji: '🌙', m: n.cena },
  ];

  return (
    <div className="nutri-view">
      <p className="anclas-intro">
        Cuerpo limpio = mente clara. Tres tomas. Sin azúcar, sin ultraprocesados, sin alcohol.
      </p>

      <div className="meals-grid">
        {meals.map(({id, emoji, m}) => (
          <div key={id} className={`meal-card ${data[id]?'done':''}`}>
            <div className="meal-head">
              <div className="meal-emoji">{emoji}</div>
              <div className="meal-titles">
                <div className="meal-name">{m.name}</div>
                <div className="meal-time">{m.time}</div>
              </div>
              <button className={`meal-check ${data[id]?'on':''}`} onClick={()=>set(id, !data[id])}>{data[id]?'✓':'+'}</button>
            </div>
            <p className="meal-desc">{m.desc}</p>
            <div className="meal-macros">
              {m.macros.map((mc, i) => <span key={i}>{mc}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="suplementos-card">
        <h4>Suplementos</h4>
        <ul>{window.SUPLEMENTOS.map((s, i) => (
          <li key={i}><strong>{s.name}</strong> — <span>{s.timing}</span></li>
        ))}</ul>
      </div>

      <div className="variantes-card">
        <h4>Variantes de comida (lunes a sábado)</h4>
        <ul>{n.variantes.map((v, i) => <li key={i}>{v}</li>)}</ul>
      </div>

      <section className="entry-block">
        <label className="entry-label">
          <span className="entry-label-num">·</span>
          <span className="entry-label-text">Notas del día (energía, antojos, hambre)</span>
        </label>
        <textarea className="entry-textarea" rows={2}
          value={data.notas || ''}
          onChange={e=>set('notas', e.target.value)}/>
      </section>
    </div>
  );
}

function DeporteView() {
  const today = new Date().getDay(); // 0 dom
  const idxMap = [6, 0, 1, 2, 3, 4, 5]; // dom→idx 6
  return (
    <div className="deporte-view">
      <p className="anclas-intro">
        Tu fuerza física refleja tu coherencia. 5 días de fuerza/cardio + 1 ligero + descanso.
      </p>
      <div className="deporte-grid">
        {window.DEPORTE_SEMANA.map((d, i) => {
          const isToday = idxMap[today] === i;
          return (
            <div key={d.day} className={`dep-card ${isToday?'today':''} tag-${d.tag.toLowerCase()}`}>
              <div className="dep-head">
                <div className="dep-day">{d.day}</div>
                <span className="dep-tag">{d.tag}</span>
              </div>
              <h4 className="dep-name">{d.name}</h4>
              <ul>{d.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
              {isToday && <div className="dep-today-flag">Hoy</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { HabitosView });
