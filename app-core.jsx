// Componentes de la app — Cómo escuchar al Espíritu
const { useState, useEffect, useMemo, useRef } = React;

// ============== UTILIDADES ==============
const STORAGE_KEY = 'espiritu_diario_v1';

function loadState() {
  const empty = { entries: {}, modules: {}, habitsConfig: null, currentCamino: 0, weekStart: null, name: '' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed };
  } catch (e) { return empty; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dayName(d) {
  return ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()];
}
function fullDayName(d) {
  return ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][d.getDay()];
}
function monthName(d) {
  return ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][d.getMonth()];
}

// Get last 7 days as Date objects
function lastSevenDays() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

// ============== HOOK PRINCIPAL ==============
function useDiario() {
  const [state, setState] = useState(loadState);
  useEffect(() => { saveState(state); }, [state]);

  const setEntry = (key, entry) => {
    setState(s => ({ ...s, entries: { ...s.entries, [key]: entry } }));
  };
  const setModule = (key, modId, data) => {
    setState(s => ({
      ...s,
      modules: {
        ...(s.modules || {}),
        [key]: { ...((s.modules || {})[key] || {}), [modId]: data }
      }
    }));
  };
  const setHabitsConfig = (cfg) => setState(s => ({ ...s, habitsConfig: cfg }));
  const setCamino = (n) => setState(s => ({ ...s, currentCamino: n }));
  const setName = (name) => setState(s => ({ ...s, name }));
  const reset = () => setState({ entries: {}, modules: {}, habitsConfig: null, currentCamino: 0, weekStart: null, name: '' });

  return { state, setEntry, setModule, setHabitsConfig, setCamino, setName, reset };
}

// ============== HEADER ==============
function Header({ camino, view, setView, name }) {
  const groups = [
    { id: 'daily', label: 'Diario' },
    { id: 'reprog', label: 'Reprogramación' },
    { id: 'visual', label: 'Visualización' },
    { id: 'habitos', label: 'Hábitos' },
    { id: 'caminos', label: 'Caminos' },
    { id: 'calendario', label: 'Calendario' },
  ];
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 40 40" width="32" height="32">
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M 20 8 Q 26 14 26 20 Q 26 26 20 32 Q 14 26 14 20 Q 14 14 20 8 Z" fill="currentColor" opacity="0.15"/>
              <circle cx="20" cy="20" r="2.5" fill="currentColor"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">Cómo escuchar al Espíritu</div>
            <div className="brand-sub">Práctica diaria · Guillermo Ameche</div>
          </div>
        </div>
        <nav className="nav-tabs">
          {groups.map(g => (
            <button key={g.id} className={`nav-tab ${view===g.id?'active':''}`} onClick={()=>setView(g.id)}>{g.label}</button>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ============== CAMINO ACTUAL CARD ==============
function CaminoCard({ camino, compact }) {
  if (compact) {
    return (
      <div className="camino-card-compact" style={{borderColor: camino.color}}>
        <div className="camino-num" style={{color: camino.color}}>El camino de</div>
        <div className="camino-name">{camino.nombre}</div>
        <div className="camino-sub">{camino.subtitulo}</div>
      </div>
    );
  }
  return (
    <article className="camino-card" style={{'--accent': camino.color}}>
      <div className="camino-header">
        <div className="camino-num-large">{String(camino.numero).padStart(2,'0')}</div>
        <div>
          <div className="camino-eyebrow">El camino de</div>
          <h2 className="camino-name-large">{camino.nombre}</h2>
          <div className="camino-sub-large">{camino.subtitulo}</div>
        </div>
      </div>
      <blockquote className="camino-vers">{camino.versiculo}</blockquote>
    </article>
  );
}

// ============== HOY VIEW ==============
function HoyView({ state, setEntry, camino }) {
  const key = todayKey();
  const entry = state.entries[key] || { sentimiento: '', motivo: '', acontecimiento: '', respuesta: '', intensidad: 5 };
  const [draft, setDraft] = useState(entry);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setDraft(state.entries[key] || { sentimiento: '', motivo: '', acontecimiento: '', respuesta: '', intensidad: 5 });
  }, [key]);

  const update = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    setEntry(key, next);
    setSavedFlash(true);
    clearTimeout(window.__flashTo);
    window.__flashTo = setTimeout(() => setSavedFlash(false), 1200);
  };

  const today = new Date();

  return (
    <div className="hoy-view">
      <div className="hoy-grid">
        <div className="hoy-main">
          <div className="hoy-date">
            <div className="date-day">{fullDayName(today)}</div>
            <div className="date-num">{today.getDate()} de {monthName(today)}</div>
            {savedFlash && <div className="saved-flash">guardado ·</div>}
          </div>

          <section className="entry-block">
            <label className="entry-label">
              <span className="entry-label-num">01</span>
              <span className="entry-label-text">¿Qué estado de ánimo te impactó más hoy?</span>
            </label>
            <div className="sentimiento-grid">
              {window.SENTIMIENTOS.map(s => (
                <button
                  key={s.nombre}
                  className={`sentimiento-chip ${draft.sentimiento===s.nombre?'selected':''} fam-${s.familia}`}
                  onClick={() => update({ sentimiento: s.nombre })}
                >
                  <span className="chip-emoji">{s.emoji}</span>
                  <span className="chip-name">{s.nombre}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              className="entry-input"
              placeholder="O escribe el tuyo…"
              value={
                window.SENTIMIENTOS.find(s => s.nombre === draft.sentimiento) ? '' : draft.sentimiento
              }
              onChange={e => update({ sentimiento: e.target.value })}
            />
          </section>

          <section className="entry-block">
            <label className="entry-label">
              <span className="entry-label-num">02</span>
              <span className="entry-label-text">¿Por qué? <em>La causa o motivo</em></span>
            </label>
            <textarea
              className="entry-textarea"
              placeholder="Sea por algo que te pasa a ti, o por algo que sucede a otros…"
              value={draft.motivo}
              onChange={e => update({ motivo: e.target.value })}
              rows={3}
            />
          </section>

          <section className="entry-block">
            <label className="entry-label">
              <span className="entry-label-num">03</span>
              <span className="entry-label-text">El acontecimiento <em>(opcional)</em></span>
            </label>
            <textarea
              className="entry-textarea"
              placeholder="¿Qué pasó concretamente? Una escena, una conversación, un encuentro…"
              value={draft.acontecimiento}
              onChange={e => update({ acontecimiento: e.target.value })}
              rows={2}
            />
          </section>

          <section className="entry-block">
            <label className="entry-label">
              <span className="entry-label-num">04</span>
              <span className="entry-label-text">¿Cómo respondiste? <em>(opcional)</em></span>
            </label>
            <textarea
              className="entry-textarea"
              placeholder="¿Actuaste por amor? ¿Por miedo? ¿Te quedaste callado? ¿Buscaste ayuda?"
              value={draft.respuesta}
              onChange={e => update({ respuesta: e.target.value })}
              rows={2}
            />
          </section>

          <section className="entry-block">
            <label className="entry-label">
              <span className="entry-label-num">05</span>
              <span className="entry-label-text">Intensidad — del 1 al 10</span>
            </label>
            <div className="intensidad-row">
              <input
                type="range" min="1" max="10"
                value={draft.intensidad || 5}
                onChange={e => update({ intensidad: parseInt(e.target.value) })}
                className="intensidad-slider"
              />
              <div className="intensidad-num">{draft.intensidad || 5}</div>
            </div>
          </section>
        </div>

        <aside className="hoy-aside">
          <div className="aside-card camino-mini">
            <div className="aside-eyebrow">Esta semana caminas con</div>
            <CaminoCard camino={camino} compact />
            <div className="ejercicio-box">
              <div className="ejercicio-label">Ejercicio</div>
              <p>{camino.ejercicio}</p>
            </div>
          </div>

          <div className="aside-card oracion-card">
            <div className="aside-eyebrow">Oración inicial</div>
            <p className="oracion-text">{camino.oracionInicial}</p>
          </div>

          <div className="aside-card consejo-card">
            <div className="aside-eyebrow">Recuerda</div>
            <p className="consejo-text">
              No hace falta que escribas mucho. <strong>Dos minutos</strong> son suficientes.
              Hazlo en la noche o temprano al día siguiente.
            </p>
            <p className="consejo-text">
              Lo importante: escuchar lo que <em>realmente</em> sientes, sin juzgarlo.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { useDiario, Header, CaminoCard, HoyView, todayKey, dateKey, dayName, fullDayName, monthName, lastSevenDays, loadState, saveState });
