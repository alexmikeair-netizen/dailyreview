// Módulos de práctica diaria + Calendario maestro
const { useState: useStateM, useEffect: useEffectM, useMemo: useMemoM } = React;

// ============== MÓDULOS DEFINIDOS ==============
window.MODULOS = [
  { id: 'diario',   label: 'Diario del Espíritu', emoji: '✍︎', color: '#c97b50', desc: 'Escucha lo que sentiste hoy.' },
  { id: 'reprog',   label: 'Reprogramación',      emoji: '🌱', color: '#7a8a4a', desc: 'Reformula un pensamiento que te limita.' },
  { id: 'visual',   label: 'Visualización',       emoji: '☀︎', color: '#c89030', desc: 'Imagina con los cinco sentidos lo que quieres ser.' },
  { id: 'habitos',  label: 'Hábitos',             emoji: '◐', color: '#5a7090', desc: 'Marca los hábitos del día.' },
];

// ============== DAILY HUB (Diario / Semana / Resumen / Discernir) ==============
function DailyHub({ state, setEntry, camino }) {
  const [tab, setTab] = useStateM('hoy');
  return (
    <div className="daily-hub">
      <div className="sub-tabs">
        <button className={`sub-tab ${tab==='hoy'?'active':''}`} onClick={()=>setTab('hoy')}>Hoy</button>
        <button className={`sub-tab ${tab==='semana'?'active':''}`} onClick={()=>setTab('semana')}>Esta semana</button>
        <button className={`sub-tab ${tab==='resumen'?'active':''}`} onClick={()=>setTab('resumen')}>Resumen</button>
        <button className={`sub-tab ${tab==='discernir'?'active':''}`} onClick={()=>setTab('discernir')}>Discernir</button>
      </div>
      {tab==='hoy' && <window.HoyView state={state} setEntry={setEntry} camino={camino}/>}
      {tab==='semana' && <window.SemanaView state={state} setEntry={setEntry}/>}
      {tab==='resumen' && <window.ResumenView state={state}/>}
      {tab==='discernir' && <window.DiscernirHub state={state}/>}
    </div>
  );
}

// ============== REPROGRAMACIÓN ==============
function ReprogView({ state, setModule }) {
  const key = window.todayKey();
  const data = state.modules?.[key]?.reprog || { pensamiento: '', emocion: '', evidencia_a_favor: '', evidencia_en_contra: '', reformulado: '' };
  const update = (patch) => {
    const next = { ...data, ...patch };
    setModule(key, 'reprog', next);
  };

  return (
    <div className="modulo-view">
      <div className="modulo-head">
        <div className="modulo-eyebrow">MÓDULO · REPROGRAMACIÓN</div>
        <h1 className="view-title">Reprograma un pensamiento</h1>
        <p className="view-sub">San Pablo descubrió que la mirada cambia la vida. Identifica un pensamiento que te limita y reformúlalo con la mirada de Jesús.</p>
      </div>

      <div className="modulo-body">
        <section className="entry-block">
          <label className="entry-label">
            <span className="entry-label-num">01</span>
            <span className="entry-label-text">¿Qué pensamiento te ha estado pesando?</span>
          </label>
          <textarea className="entry-textarea" rows={3}
            placeholder="Ej: 'No soy suficiente.' 'Nadie me entiende.' 'No puedo cambiar.'"
            value={data.pensamiento}
            onChange={e=>update({pensamiento:e.target.value})}/>
        </section>

        <section className="entry-block">
          <label className="entry-label">
            <span className="entry-label-num">02</span>
            <span className="entry-label-text">¿Qué emoción te trae?</span>
          </label>
          <input className="entry-input" placeholder="Tristeza, miedo, enojo, desánimo…"
            value={data.emocion} onChange={e=>update({emocion:e.target.value})}/>
        </section>

        <section className="entry-block">
          <label className="entry-label">
            <span className="entry-label-num">03</span>
            <span className="entry-label-text">¿Qué evidencia hay <em>a favor</em> de ese pensamiento?</span>
          </label>
          <textarea className="entry-textarea" rows={2}
            value={data.evidencia_a_favor} onChange={e=>update({evidencia_a_favor:e.target.value})}/>
        </section>

        <section className="entry-block">
          <label className="entry-label">
            <span className="entry-label-num">04</span>
            <span className="entry-label-text">¿Qué evidencia hay <em>en contra</em>?</span>
          </label>
          <textarea className="entry-textarea" rows={2}
            placeholder="Hechos, recuerdos, voces de quienes te quieren…"
            value={data.evidencia_en_contra} onChange={e=>update({evidencia_en_contra:e.target.value})}/>
        </section>

        <section className="entry-block">
          <label className="entry-label">
            <span className="entry-label-num">05</span>
            <span className="entry-label-text">Reformúlalo como lo diría Jesús</span>
          </label>
          <textarea className="entry-textarea" rows={3}
            placeholder="'Mi poder se muestra mejor en los débiles.' Reescribe el pensamiento con misericordia y verdad."
            value={data.reformulado} onChange={e=>update({reformulado:e.target.value})}/>
        </section>

        <div className="versiculo-box">
          <em>"Mi amor es todo lo que necesitas; mi poder se muestra mejor en los débiles."</em>
          <span>— 2 Cor 12,9</span>
        </div>
      </div>
    </div>
  );
}

// ============== VISUALIZACIÓN ==============
function VisualView({ state, setModule }) {
  const key = window.todayKey();
  const data = state.modules?.[key]?.visual || { escena: '', vista: '', oido: '', tacto: '', olfato: '', sentir: '', minutos: 0 };
  const update = (patch) => setModule(key, 'visual', { ...data, ...patch });

  const [running, setRunning] = useStateM(false);
  const [secs, setSecs] = useStateM(0);
  useEffectM(() => {
    if (!running) return;
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffectM(() => { if (secs > 0 && secs % 60 === 0) update({minutos: Math.floor(secs/60)}); }, [secs]);

  return (
    <div className="modulo-view">
      <div className="modulo-head">
        <div className="modulo-eyebrow">MÓDULO · VISUALIZACIÓN</div>
        <h1 className="view-title">Visualiza con los cinco sentidos</h1>
        <p className="view-sub">San Ignacio enseñaba a entrar en la escena con todo el cuerpo. Imagina la situación que deseas — o la persona que quieres llegar a ser — usando los sentidos.</p>
      </div>

      <div className="modulo-body">
        <section className="entry-block">
          <label className="entry-label">
            <span className="entry-label-num">01</span>
            <span className="entry-label-text">¿Qué escena vas a visualizar?</span>
          </label>
          <textarea className="entry-textarea" rows={2}
            placeholder="Una situación que te llene de paz, una versión tuya más libre, un momento de servicio…"
            value={data.escena} onChange={e=>update({escena:e.target.value})}/>
        </section>

        <div className="sentidos-grid">
          <div className="sentido-card">
            <div className="sentido-icon">👁️</div>
            <label>Lo que ves</label>
            <textarea rows={2} value={data.vista} onChange={e=>update({vista:e.target.value})} placeholder="Colores, luz, gestos, paisaje…"/>
          </div>
          <div className="sentido-card">
            <div className="sentido-icon">👂</div>
            <label>Lo que oyes</label>
            <textarea rows={2} value={data.oido} onChange={e=>update({oido:e.target.value})} placeholder="Voces, silencio, viento, música…"/>
          </div>
          <div className="sentido-card">
            <div className="sentido-icon">✋</div>
            <label>Lo que tocas / sientes en el cuerpo</label>
            <textarea rows={2} value={data.tacto} onChange={e=>update({tacto:e.target.value})} placeholder="Calor, brisa, peso, una mano amiga…"/>
          </div>
          <div className="sentido-card">
            <div className="sentido-icon">👃</div>
            <label>Lo que hueles / saboreas</label>
            <textarea rows={2} value={data.olfato} onChange={e=>update({olfato:e.target.value})} placeholder="Pan, café, tierra mojada, mar…"/>
          </div>
        </div>

        <section className="entry-block">
          <label className="entry-label">
            <span className="entry-label-num">02</span>
            <span className="entry-label-text">¿Qué se mueve en tu corazón ahí?</span>
          </label>
          <textarea className="entry-textarea" rows={3}
            placeholder="¿Qué sientes? ¿Paz, gratitud, alegría, valor? Eso es lo que el Espíritu quiere para ti."
            value={data.sentir} onChange={e=>update({sentir:e.target.value})}/>
        </section>

        <div className="timer-box">
          <div className="timer-label">Tiempo en la escena</div>
          <div className="timer-display">{Math.floor(secs/60)}:{String(secs%60).padStart(2,'0')}</div>
          <button className="timer-btn" onClick={()=>setRunning(r=>!r)}>{running?'Pausar':'Comenzar'}</button>
          {secs>0 && <button className="timer-btn ghost" onClick={()=>{setRunning(false);setSecs(0);}}>Reiniciar</button>}
        </div>
      </div>
    </div>
  );
}

// ============== HÁBITOS ==============
const HABITOS_DEFAULT = [
  { id: 'oracion', label: 'Oración matutina', emoji: '🌅' },
  { id: 'lectura', label: 'Lectura del Evangelio', emoji: '📖' },
  { id: 'silencio', label: '10 min de silencio', emoji: '🕯️' },
  { id: 'examen', label: 'Examen de conciencia (noche)', emoji: '🌙' },
  { id: 'servicio', label: 'Un acto de servicio', emoji: '🤲' },
  { id: 'gratitud', label: 'Tres gracias del día', emoji: '🌿' },
];

function HabitosView({ state, setModule, setHabitsConfig }) {
  const key = window.todayKey();
  const habitos = state.habitsConfig?.length ? state.habitsConfig : HABITOS_DEFAULT;
  const data = state.modules?.[key]?.habitos || {};
  const toggle = (id) => setModule(key, 'habitos', { ...data, [id]: !data[id] });

  const [editing, setEditing] = useStateM(false);
  const [draftLabel, setDraftLabel] = useStateM('');
  const [draftEmoji, setDraftEmoji] = useStateM('•');

  const addHabit = () => {
    if (!draftLabel.trim()) return;
    const next = [...habitos, { id: 'h_' + Date.now(), label: draftLabel.trim(), emoji: draftEmoji || '•' }];
    setHabitsConfig(next);
    setDraftLabel(''); setDraftEmoji('•');
  };
  const removeHabit = (id) => setHabitsConfig(habitos.filter(h => h.id !== id));

  // 7-day strip
  const days = window.lastSevenDays();

  return (
    <div className="modulo-view">
      <div className="modulo-head">
        <div className="modulo-eyebrow">MÓDULO · HÁBITOS</div>
        <h1 className="view-title">Tus hábitos del Espíritu</h1>
        <p className="view-sub">Pequeños gestos diarios que sostienen el caminar. Marca los que hiciste hoy.</p>
      </div>

      <div className="habitos-today">
        {habitos.map(h => (
          <button key={h.id}
            className={`habito-btn ${data[h.id]?'done':''}`}
            onClick={()=>toggle(h.id)}>
            <span className="habito-emoji">{h.emoji}</span>
            <span className="habito-label">{h.label}</span>
            <span className="habito-check">{data[h.id]?'✓':''}</span>
          </button>
        ))}
      </div>

      <div className="habitos-week">
        <h3>Tu semana</h3>
        <table className="habitos-table">
          <thead>
            <tr>
              <th></th>
              {days.map(d => <th key={d.toISOString()}>{window.dayName(d)}<br/><span className="hd-num">{d.getDate()}</span></th>)}
            </tr>
          </thead>
          <tbody>
            {habitos.map(h => (
              <tr key={h.id}>
                <td className="hb-label"><span>{h.emoji}</span> {h.label}</td>
                {days.map(d => {
                  const k = window.dateKey(d);
                  const done = state.modules?.[k]?.habitos?.[h.id];
                  return <td key={k} className={`hb-cell ${done?'done':''}`}>{done?'●':'○'}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="habitos-edit">
        <button className="text-btn" onClick={()=>setEditing(e=>!e)}>{editing?'Cerrar':'Personalizar mis hábitos'}</button>
        {editing && (
          <div className="edit-panel">
            <ul className="edit-list">
              {habitos.map(h => (
                <li key={h.id}>
                  <span>{h.emoji} {h.label}</span>
                  <button className="x-btn" onClick={()=>removeHabit(h.id)}>×</button>
                </li>
              ))}
            </ul>
            <div className="edit-add">
              <input className="entry-input small" style={{maxWidth:60}} value={draftEmoji} onChange={e=>setDraftEmoji(e.target.value)} placeholder="•"/>
              <input className="entry-input" value={draftLabel} onChange={e=>setDraftLabel(e.target.value)} placeholder="Nuevo hábito…" onKeyDown={e=>e.key==='Enter'&&addHabit()}/>
              <button className="text-btn primary" onClick={addHabit}>+ Agregar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============== CALENDARIO ==============
function CalendarioView({ state }) {
  const today = new Date();
  const [cursor, setCursor] = useStateM(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month+1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7; // lunes=0
  const daysInMonth = lastDay.getDate();

  const cells = [];
  for (let i=0;i<startWeekday;i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const moduleStatus = (date) => {
    if (!date) return null;
    const k = window.dateKey(date);
    const e = state.entries[k];
    const m = state.modules?.[k] || {};
    return {
      diario: !!(e?.sentimiento),
      reprog: !!(m.reprog?.pensamiento),
      visual: !!(m.visual?.escena),
      habitos: m.habitos ? Object.values(m.habitos).some(Boolean) : false,
    };
  };

  const monthLabel = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][month];
  const isToday = (d) => d && window.dateKey(d) === window.todayKey();

  // Stats this month
  const monthDays = [];
  for (let d=1; d<=daysInMonth; d++) monthDays.push(new Date(year, month, d));
  const stats = monthDays.reduce((acc, d) => {
    const s = moduleStatus(d);
    if (!s) return acc;
    if (s.diario) acc.diario++;
    if (s.reprog) acc.reprog++;
    if (s.visual) acc.visual++;
    if (s.habitos) acc.habitos++;
    if (s.diario || s.reprog || s.visual || s.habitos) acc.algun++;
    return acc;
  }, { diario:0, reprog:0, visual:0, habitos:0, algun:0 });

  const [selected, setSelected] = useStateM(null);
  const selStatus = selected ? moduleStatus(selected) : null;

  return (
    <div className="cal-view">
      <div className="cal-head">
        <h1 className="view-title">Calendario</h1>
        <p className="view-sub">Una mirada a tu caminar mes a mes. Cada día muestra qué módulos completaste.</p>
      </div>

      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={()=>setCursor(new Date(year, month-1, 1))}>‹</button>
        <h2 className="cal-month">{monthLabel} <span className="cal-year">{year}</span></h2>
        <button className="cal-nav-btn" onClick={()=>setCursor(new Date(year, month+1, 1))}>›</button>
      </div>

      <div className="cal-stats">
        {window.MODULOS.map(m => (
          <div key={m.id} className="cal-stat" style={{'--mc': m.color}}>
            <div className="cal-stat-emoji">{m.emoji}</div>
            <div className="cal-stat-num">{stats[m.id]||0}</div>
            <div className="cal-stat-label">{m.label}</div>
          </div>
        ))}
        <div className="cal-stat any">
          <div className="cal-stat-emoji">✦</div>
          <div className="cal-stat-num">{stats.algun}</div>
          <div className="cal-stat-label">Días con algo</div>
        </div>
      </div>

      <div className="cal-grid">
        {['L','M','X','J','V','S','D'].map(d => <div key={d} className="cal-dow">{d}</div>)}
        {cells.map((d, i) => {
          const s = moduleStatus(d);
          if (!d) return <div key={i} className="cal-cell empty"/>;
          const filled = s ? Object.values(s).filter(Boolean).length : 0;
          return (
            <button key={i}
              className={`cal-cell ${isToday(d)?'today':''} ${filled>0?'has':''} ${selected && window.dateKey(selected)===window.dateKey(d)?'sel':''}`}
              onClick={()=>setSelected(d)}>
              <div className="cal-cell-num">{d.getDate()}</div>
              <div className="cal-dots">
                {window.MODULOS.map(m => (
                  <span key={m.id}
                    className={`cal-dot ${s[m.id]?'on':''}`}
                    style={{'--mc': m.color}}
                    title={m.label}/>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selected && selStatus && (
        <div className="cal-detail">
          <div className="cal-detail-head">
            <div>
              <div className="cd-eyebrow">{window.fullDayName(selected)}</div>
              <h3>{selected.getDate()} de {monthLabel}</h3>
            </div>
            <button className="x-btn" onClick={()=>setSelected(null)}>×</button>
          </div>
          <div className="cal-detail-list">
            {window.MODULOS.map(m => (
              <div key={m.id} className={`cd-row ${selStatus[m.id]?'done':''}`} style={{'--mc': m.color}}>
                <span className="cd-emoji">{m.emoji}</span>
                <span className="cd-label">{m.label}</span>
                <span className="cd-check">{selStatus[m.id]?'✓':'·'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============== DISCERNIR HUB (mueve aquí el flujo) ==============
// Re-exporta el componente Discernir originalmente en app-discern.jsx pero conservando el estado por sesión.
// Para mantener la lógica intacta, simplemente re-renderizamos el flujo si existe.
function DiscernirHub({ state }) {
  if (window._OldDiscernirView) return <window._OldDiscernirView state={state}/>;
  return (
    <div className="discernir-view">
      <h1 className="view-title">Discernimiento guiado</h1>
      <p className="view-sub">Pronto…</p>
    </div>
  );
}

Object.assign(window, {
  DailyHub, ReprogView, VisualView, HabitosView, CalendarioView, DiscernirHub
});
