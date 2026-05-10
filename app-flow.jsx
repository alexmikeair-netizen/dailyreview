// Discernimiento guiado (5 pasos)
const { useState: useStateD } = React;

function DiscernirView({ state }) {
  const a = window.analizarSemana(state);
  const [step, setStep] = useStateD(0);
  const [answers, setAnswers] = useStateD({
    ganar: '', perder: '', persona: '', motivacion: '', accion: '', paz: null
  });
  const update = (k, v) => setAnswers(prev => ({ ...prev, [k]: v }));

  if (!a.dominante) {
    return (
      <div className="discernir-view">
        <h1 className="view-title">Discernir</h1>
        <div className="empty-state">
          <div className="empty-glyph">·</div>
          <p>Para discernir primero necesitas escuchar.</p>
          <p className="empty-sub">Registra tus sentimientos al menos un día y vuelve aquí.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { title: '01 · Escuchar', content: (
      <div>
        <p>Esta semana tu emoción dominante fue:</p>
        <div className="big-emocion">
          <span className="big-emocion-emoji">{window.SENTIMIENTOS.find(s=>s.nombre===a.dominante)?.emoji||'·'}</span>
          <span className="big-emocion-name">{a.dominante}</span>
        </div>
        <p>Apareció <strong>{a.dominanteCount}</strong> {a.dominanteCount===1?'vez':'veces'}. Lo que se repite es lo que Dios quiere que veas.</p>
        <p className="muted">Aquí no hay sentimientos malos. Solo escúchalos sin juzgarlos.</p>
      </div>
    )},
    { title: '02 · Comprender', content: (
      <div>
        <p>Si sigues este sentimiento de <em>{a.dominante}</em> hasta el final…</p>
        <label className="step-label">¿Qué <strong>ganarías</strong>?</label>
        <textarea className="entry-textarea" rows={2} value={answers.ganar} onChange={e=>update('ganar',e.target.value)}/>
        <label className="step-label">¿Qué <strong>perderías</strong>?</label>
        <textarea className="entry-textarea" rows={2} value={answers.perder} onChange={e=>update('perder',e.target.value)}/>
        <label className="step-label">¿Qué <strong>tipo de persona</strong> te estarías haciendo?</label>
        <textarea className="entry-textarea" rows={2} value={answers.persona} onChange={e=>update('persona',e.target.value)}/>
      </div>
    )},
    { title: '03 · Las 6 reglas', content: (
      <div>
        <p>Antes de decidir, revisa las reglas de Elías:</p>
        <div className="reglas-grid compact">
          {window.REGLAS_ELIAS.map(r => (
            <div key={r.num} className="regla-card mini">
              <div className="regla-num">R{r.num}</div>
              <div className="regla-titulo">{r.titulo}</div>
              <div className="regla-texto">{r.texto}</div>
            </div>
          ))}
        </div>
      </div>
    )},
    { title: '04 · Discernir', content: (
      <div>
        <p>Ahora la pregunta clave de Ester:</p>
        <label className="step-label">¿Qué te <strong>motiva</strong>?</label>
        <div className="motivacion-row">
          <button className={`motivacion-btn ${answers.motivacion==='miedo'?'selected bad':''}`} onClick={()=>update('motivacion','miedo')}>Miedo</button>
          <button className={`motivacion-btn ${answers.motivacion==='amor'?'selected good':''}`} onClick={()=>update('motivacion','amor')}>Amor</button>
          <button className={`motivacion-btn ${answers.motivacion==='deber'?'selected':''}`} onClick={()=>update('motivacion','deber')}>Deber / culpa</button>
          <button className={`motivacion-btn ${answers.motivacion==='no se'?'selected':''}`} onClick={()=>update('motivacion','no se')}>No lo sé</button>
        </div>
        <label className="step-label">Cuando piensas en actuar así, ¿qué sientes en el fondo del corazón?</label>
        <div className="motivacion-row">
          <button className={`motivacion-btn ${answers.paz===true?'selected good':''}`} onClick={()=>update('paz',true)}>🕊️ Paz profunda</button>
          <button className={`motivacion-btn ${answers.paz===false?'selected bad':''}`} onClick={()=>update('paz',false)}>🌬️ Intranquilidad</button>
        </div>
      </div>
    )},
    { title: '05 · Actuar', content: (
      <div>
        {(() => {
          const buena = answers.motivacion === 'amor';
          const haypaz = answers.paz === true;
          if (buena && haypaz) return (<div className="veredicto good"><div className="veredicto-icon">🕊️</div><h3>Vas por donde Dios quiere</h3><p>Si actúas <strong>por amor</strong> y sientes <strong>paz profunda</strong>, esa es la voluntad del Dios vivo.</p></div>);
          if (haypaz === false) return (<div className="veredicto warn"><div className="veredicto-icon">🌬️</div><h3>Detente y escucha</h3><p>Si te queda intranquilidad, eso no viene del Espíritu. Busca la acción que te daría paz.</p></div>);
          return (<div className="veredicto neutral"><div className="veredicto-icon">·</div><h3>Sigue escuchando</h3><p>Aún no hay claridad. Tómate tiempo. Platícalo con alguien que te conoce y te quiere.</p></div>);
        })()}
        <label className="step-label">Si pudieras dar <strong>un paso pequeño</strong> esta semana, ¿cuál sería?</label>
        <textarea className="entry-textarea" rows={3} value={answers.accion} onChange={e=>update('accion',e.target.value)}/>
      </div>
    )}
  ];

  return (
    <div className="discernir-view">
      <h1 className="view-title">Discernimiento guiado</h1>
      <p className="view-sub">Cinco pasos sobre lo que más te ha movido esta semana.</p>
      <div className="step-progress">
        {steps.map((s, i) => (
          <button key={i} className={`step-dot ${i===step?'active':''} ${i<step?'done':''}`} onClick={()=>setStep(i)}>
            <span className="step-dot-num">{i+1}</span>
            <span className="step-dot-label">{s.title.split('·')[1]?.trim()}</span>
          </button>
        ))}
      </div>
      <div className="step-card">
        <h2 className="step-title">{steps[step].title}</h2>
        {steps[step].content}
        <div className="step-nav">
          <button className="step-nav-btn" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>← Anterior</button>
          <button className="step-nav-btn primary" disabled={step===steps.length-1} onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))}>Siguiente →</button>
        </div>
      </div>
    </div>
  );
}

window._OldDiscernirView = DiscernirView;
window.DiscernirView = DiscernirView;
