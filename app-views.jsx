// Vistas: Semana, Resumen, Caminos, Discernir
const { useState: useStateB, useEffect: useEffectB, useMemo: useMemoB } = React;

// ============== SEMANA VIEW ==============
function SemanaView({ state, setEntry }) {
  const days = window.lastSevenDays();
  const [selectedIdx, setSelectedIdx] = useStateB(6);
  const selectedDate = days[selectedIdx];
  const key = window.dateKey(selectedDate);
  const entry = state.entries[key] || { sentimiento: '', motivo: '', acontecimiento: '', respuesta: '' };

  const update = (patch) => {
    const next = { ...entry, ...patch };
    setEntry(key, next);
  };

  return (
    <div className="semana-view">
      <h1 className="view-title">Esta semana</h1>
      <p className="view-sub">Una mirada a los últimos 7 días. Toca un día para verlo o editarlo.</p>

      <div className="semana-strip">
        {days.map((d, i) => {
          const k = window.dateKey(d);
          const e = state.entries[k];
          const sent = e?.sentimiento;
          const sentObj = window.SENTIMIENTOS.find(s => s.nombre === sent);
          return (
            <button
              key={k}
              className={`day-card ${i===selectedIdx?'selected':''} ${e?'has-entry':''}`}
              onClick={() => setSelectedIdx(i)}
            >
              <div className="day-name">{window.dayName(d)}</div>
              <div className="day-num">{d.getDate()}</div>
              <div className="day-emoji">{sentObj ? sentObj.emoji : '·'}</div>
              <div className="day-sent">{sent || '—'}</div>
            </button>
          );
        })}
      </div>

      <div className="semana-detail">
        <div className="detail-header">
          <h2>{window.fullDayName(selectedDate)} {selectedDate.getDate()} de {window.monthName(selectedDate)}</h2>
        </div>

        <div className="detail-grid">
          <div className="detail-block">
            <label className="entry-label-mini">Sentimiento</label>
            <input
              type="text"
              className="entry-input"
              placeholder="¿Cómo te sentiste?"
              value={entry.sentimiento || ''}
              onChange={e => update({ sentimiento: e.target.value })}
            />
          </div>
          <div className="detail-block">
            <label className="entry-label-mini">Motivo</label>
            <textarea
              className="entry-textarea"
              placeholder="¿Por qué?"
              value={entry.motivo || ''}
              onChange={e => update({ motivo: e.target.value })}
              rows={2}
            />
          </div>
          <div className="detail-block">
            <label className="entry-label-mini">Acontecimiento</label>
            <textarea
              className="entry-textarea"
              placeholder="¿Qué pasó?"
              value={entry.acontecimiento || ''}
              onChange={e => update({ acontecimiento: e.target.value })}
              rows={2}
            />
          </div>
          <div className="detail-block">
            <label className="entry-label-mini">Respuesta</label>
            <textarea
              className="entry-textarea"
              placeholder="¿Cómo respondiste?"
              value={entry.respuesta || ''}
              onChange={e => update({ respuesta: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== RESUMEN SEMANAL ==============
function analizarSemana(state) {
  const days = window.lastSevenDays();
  const entries = days.map(d => ({ date: d, entry: state.entries[window.dateKey(d)] })).filter(x => x.entry?.sentimiento);

  // contar sentimientos
  const counts = {};
  const familyCounts = { positivo: 0, mixto: 0, negativo: 0, otro: 0 };
  entries.forEach(({ entry }) => {
    const s = entry.sentimiento;
    counts[s] = (counts[s] || 0) + 1;
    const fam = window.SENTIMIENTOS.find(x => x.nombre === s)?.familia || 'otro';
    familyCounts[fam] = (familyCounts[fam] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
  const dominante = sorted[0]?.[0] || null;
  const dominanteCount = sorted[0]?.[1] || 0;

  const motivos = entries.map(e => e.entry.motivo).filter(Boolean);
  const acontecimientos = entries.map(e => ({ d: e.date, a: e.entry.acontecimiento })).filter(x => x.a);
  const respuestas = entries.map(e => e.entry.respuesta).filter(Boolean);

  const totalDays = entries.length;
  const promIntensidad = entries.length
    ? entries.reduce((sum, e) => sum + (parseInt(e.entry.intensidad) || 5), 0) / entries.length
    : 0;

  // discernimiento: tendencia
  let tendencia = 'mixta';
  if (familyCounts.positivo > familyCounts.negativo + familyCounts.mixto) tendencia = 'consolación';
  else if (familyCounts.negativo > familyCounts.positivo + familyCounts.mixto) tendencia = 'desolación';

  return { entries, counts, sorted, dominante, dominanteCount, familyCounts, motivos, acontecimientos, respuestas, totalDays, promIntensidad, tendencia };
}

function ResumenView({ state }) {
  const a = window.useMemo ? React.useMemo(() => analizarSemana(state), [state]) : analizarSemana(state);
  const dominanteObj = window.SENTIMIENTOS.find(s => s.nombre === a.dominante);

  if (a.totalDays === 0) {
    return (
      <div className="resumen-view">
        <h1 className="view-title">Resumen de tu semana</h1>
        <div className="empty-state">
          <div className="empty-glyph">𓍯</div>
          <p>Aún no has registrado nada esta semana.</p>
          <p className="empty-sub">Empieza con dos minutos hoy. Lo demás vendrá.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resumen-view">
      <div className="resumen-head">
        <h1 className="view-title">Resumen de tu semana</h1>
        <p className="view-sub">"Lo que se repite más, quiere decir que te está afectando más, y eso es exactamente lo que Dios quiere que veas." — Ameche</p>
      </div>

      {/* Dominante grande */}
      <div className="dominante-card">
        <div className="dominante-eyebrow">Tu emoción dominante</div>
        <div className="dominante-content">
          <div className="dominante-emoji">{dominanteObj?.emoji || '·'}</div>
          <div>
            <div className="dominante-name">{a.dominante}</div>
            <div className="dominante-meta">apareció <strong>{a.dominanteCount}</strong> {a.dominanteCount===1?'vez':'veces'} en {a.totalDays} {a.totalDays===1?'día':'días'} registrados</div>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-num">{a.totalDays}/7</div>
          <div className="metric-label">Días registrados</div>
        </div>
        <div className="metric-card">
          <div className="metric-num">{a.promIntensidad.toFixed(1)}</div>
          <div className="metric-label">Intensidad promedio</div>
        </div>
        <div className="metric-card tendencia-card" data-tendencia={a.tendencia}>
          <div className="metric-num small">{a.tendencia === 'consolación' ? 'Consolación' : a.tendencia === 'desolación' ? 'Desolación' : 'Mixta'}</div>
          <div className="metric-label">Tendencia espiritual</div>
        </div>
      </div>

      {/* Distribución */}
      <div className="dist-card">
        <h3>Distribución de la semana</h3>
        <div className="dist-bars">
          {a.sorted.map(([name, count]) => {
            const obj = window.SENTIMIENTOS.find(s => s.nombre === name);
            const fam = obj?.familia || 'otro';
            const pct = (count / a.totalDays) * 100;
            return (
              <div key={name} className={`dist-bar fam-${fam}`}>
                <div className="dist-bar-label">
                  <span>{obj?.emoji || '·'}</span>
                  <span>{name}</span>
                </div>
                <div className="dist-bar-track">
                  <div className="dist-bar-fill" style={{width: `${pct}%`}}/>
                </div>
                <div className="dist-bar-count">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivos */}
      {a.motivos.length > 0 && (
        <div className="motivos-card">
          <h3>Tus motivos esta semana</h3>
          <ul className="motivos-list">
            {a.motivos.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      {/* Acontecimientos */}
      {a.acontecimientos.length > 0 && (
        <div className="motivos-card">
          <h3>Acontecimientos</h3>
          <ul className="motivos-list">
            {a.acontecimientos.map((x, i) => (
              <li key={i}><strong>{window.dayName(x.d)} {x.d.getDate()}:</strong> {x.a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Respuestas */}
      {a.respuestas.length > 0 && (
        <div className="motivos-card">
          <h3>Cómo respondiste</h3>
          <ul className="motivos-list">
            {a.respuestas.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {/* Pasos de discernimiento */}
      <div className="discern-card">
        <h3>Los tres pasos de Ester</h3>
        <p className="discern-intro">Ahora que has <strong>escuchado</strong> tus sentimientos, da los siguientes pasos:</p>
        <ol className="discern-steps">
          <li>
            <strong>Comprender</strong> — ¿Hasta dónde te lleva ese sentimiento dominante de <em>{a.dominante}</em>? ¿Qué ganas si lo sigues? ¿Qué pierdes? ¿Qué tipo de persona te haces?
          </li>
          <li>
            <strong>Discernir</strong> — Si la decisión te llena de <em>paz profunda</em>, viene de Dios. Si te deja <em>intranquilo</em>, no.
          </li>
          <li>
            <strong>Actuar</strong> — Por amor y con paz en el corazón. Esa es la voluntad de Dios.
          </li>
        </ol>
        <div className="discern-cta">
          <p>👉 Ve a la pestaña <strong>Discernir</strong> para hacer este ejercicio guiado con tu sentimiento dominante.</p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SemanaView, ResumenView, analizarSemana });
