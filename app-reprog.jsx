// Vista REPROGRAMACIÓN — Identidad nueva
// 4 sub-prácticas: Anclas y Decretos · Canvas de Sombras · Pre-Venta · Pre-Grabación
const { useState: useStateR, useEffect: useEffectR, useMemo: useMemoR } = React;

function ReprogView({ state, setModule }) {
  const [tab, setTab] = useStateR('anclas');
  return (
    <div className="reprog-view">
      <div className="reprog-head">
        <div className="modulo-eyebrow">REPROGRAMACIÓN · IDENTIDAD NUEVA</div>
        <h1 className="view-title">Reprograma quién eres</h1>
        <p className="view-sub">El soldado que seguía órdenes ya cumplió. Ahora eres el creador. Aquí entrenas la mente y el cuerpo para sostener lo que viene.</p>
      </div>

      <div className="sub-tabs reprog-tabs">
        <button className={`sub-tab ${tab==='anclas'?'active':''}`} onClick={()=>setTab('anclas')}>Anclas y Decretos</button>
        <button className={`sub-tab ${tab==='sombras'?'active':''}`} onClick={()=>setTab('sombras')}>Canvas de Sombras</button>
        <button className={`sub-tab ${tab==='preventa'?'active':''}`} onClick={()=>setTab('preventa')}>Pre-Venta</button>
        <button className={`sub-tab ${tab==='pregrab'?'active':''}`} onClick={()=>setTab('pregrab')}>Pre-Grabación</button>
      </div>

      {tab==='anclas' && <AnclasView state={state} setModule={setModule}/>}
      {tab==='sombras' && <SombrasView state={state} setModule={setModule}/>}
      {(tab==='preventa' || tab==='pregrab') && <RitualView ritualId={tab==='preventa'?'preventa':'pregrabacion'} state={state} setModule={setModule}/>}
    </div>
  );
}

// ============== ANCLAS Y DECRETOS ==============
function AnclasView({ state, setModule }) {
  const fases = window.ANCLAS_FASES;
  const [openFase, setOpenFase] = useStateR(1);
  const key = window.todayKey();
  const data = state.modules?.[key]?.anclas || { activadas: {}, notas: '' };

  const toggleAncla = (faseId, idx) => {
    const id = `${faseId}-${idx}`;
    const next = { ...(data.activadas||{}), [id]: !data.activadas?.[id] };
    setModule(key, 'anclas', { ...data, activadas: next });
  };
  const setNotas = (v) => setModule(key, 'anclas', { ...data, notas: v });

  return (
    <div className="anclas-view">
      <p className="anclas-intro">
        Identifica el patrón viejo, hazlo consciente, instala el ancla física y declara el decreto.
        Marca cada ancla que actives hoy. Repetición = identidad nueva.
      </p>

      <div className="fases-list">
        {fases.map(fase => (
          <div key={fase.id} className={`fase-card ${openFase===fase.id?'open':''}`}>
            <button className="fase-head" onClick={()=>setOpenFase(openFase===fase.id?null:fase.id)}>
              <div className="fase-num">FASE {String(fase.id).padStart(2,'0')}</div>
              <div className="fase-title-wrap">
                <h3 className="fase-title">{fase.title}</h3>
                <p className="fase-intro">{fase.intro}</p>
              </div>
              <div className="fase-toggle">{openFase===fase.id?'−':'+'}</div>
            </button>

            {openFase===fase.id && (
              <div className="fase-body">
                {fase.anclas.map((a, idx) => {
                  const id = `${fase.id}-${idx}`;
                  const active = !!data.activadas?.[id];
                  return (
                    <div key={idx} className={`ancla-block ${active?'active':''}`}>
                      <div className="ancla-row">
                        <button className={`ancla-check ${active?'on':''}`} onClick={()=>toggleAncla(fase.id, idx)}>
                          {active?'✓':''}
                        </button>
                        <div className="ancla-content">
                          <div className="ancla-patron">⚠ Patrón: <span>{a.patron}</span></div>
                          {a.disonancia && <div className="ancla-diso">"<em>{a.disonancia}</em>"</div>}
                          <div className="ancla-section">
                            <div className="as-label">PNL · Acción física</div>
                            <div className="as-text">{a.pnl}</div>
                          </div>
                          <div className="ancla-section decreto">
                            <div className="as-label">Decreto</div>
                            <div className="as-text">"{a.decreto}"</div>
                          </div>
                          {a.resultado && (
                            <div className="ancla-section result">
                              <div className="as-label">Resultado esperado</div>
                              <div className="as-text">{a.resultado}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="entry-block reprog-notas">
        <label className="entry-label">
          <span className="entry-label-num">+</span>
          <span className="entry-label-text">Notas del día — ¿Qué pidió mi sistema reprogramar hoy?</span>
        </label>
        <textarea className="entry-textarea" rows={3}
          placeholder="¿Qué patrón apareció? ¿Qué ancla activaste? ¿Qué cambió?"
          value={data.notas || ''} onChange={e=>setNotas(e.target.value)}/>
      </section>
    </div>
  );
}

// ============== CANVAS DE SOMBRAS ==============
function SombrasView({ state, setModule }) {
  const sombras = window.SOMBRAS;
  const [active, setActive] = useStateR(1);
  const sombra = sombras.find(s => s.id === active);
  const key = window.todayKey();
  const data = state.modules?.[key]?.sombras || {};
  const sData = data[active] || { reconocida: false, respuestas: ['','',''], objetivo: '' };

  const update = (patch) => {
    const nextS = { ...sData, ...patch };
    setModule(key, 'sombras', { ...data, [active]: nextS });
  };
  const setResp = (i, v) => {
    const r = [...(sData.respuestas || ['','',''])];
    r[i] = v;
    update({ respuestas: r });
  };

  return (
    <div className="sombras-view">
      <p className="anclas-intro">
        15 sombras del Manual Personal. La sombra no es enemiga: es información. Reconócela, hazle las preguntas, recibe el decreto y ofrece la oración. Hoy elige una. Mañana otra.
      </p>

      <div className="sombras-grid-tabs">
        {sombras.map(s => (
          <button key={s.id}
            className={`sombra-tab ${active===s.id?'on':''} ${data[s.id]?.reconocida?'rec':''}`}
            onClick={()=>setActive(s.id)}>
            <span className="sombra-num">{String(s.id).padStart(2,'0')}</span>
            <span className="sombra-name">{s.name}</span>
          </button>
        ))}
      </div>

      <div className="sombra-card">
        <div className="sombra-head">
          <div>
            <div className="sombra-eyebrow">SOMBRA {String(sombra.id).padStart(2,'0')}</div>
            <h2 className="sombra-title">{sombra.name}</h2>
          </div>
          <label className="sombra-mark">
            <input type="checkbox" checked={!!sData.reconocida} onChange={e=>update({reconocida:e.target.checked})}/>
            <span>Reconocida hoy</span>
          </label>
        </div>

        <div className="sombra-grid">
          <div className="sombra-block">
            <div className="sb-label">¿Qué es?</div>
            <p>{sombra.que}</p>
          </div>
          <div className="sombra-block">
            <div className="sb-label">Cómo se canaliza</div>
            <p>{sombra.canal}</p>
          </div>
        </div>

        <div className="sombra-block preguntas">
          <div className="sb-label">Tres preguntas para sentarte con ella</div>
          {sombra.preguntas.map((p, i) => (
            <div key={i} className="pregunta-row">
              <div className="p-q">{p}</div>
              <textarea className="entry-textarea" rows={2}
                placeholder="Tu respuesta…"
                value={sData.respuestas?.[i] || ''}
                onChange={e=>setResp(i, e.target.value)}/>
            </div>
          ))}
        </div>

        <div className="sombra-block decreto-box">
          <div className="sb-label">Decreto</div>
          <blockquote>"{sombra.decreto}"</blockquote>
        </div>

        <div className="sombra-grid">
          <div className="sombra-block">
            <div className="sb-label">Ancla física</div>
            <p>{sombra.ancla}</p>
          </div>
          <div className="sombra-block oracion">
            <div className="sb-label">Oración</div>
            <p><em>{sombra.oracion}</em></p>
          </div>
        </div>

        <div className="sombra-block objetivo-box">
          <div className="sb-label">Objetivo concreto del día</div>
          <p className="ob-default">{sombra.objetivo}</p>
          <textarea className="entry-textarea" rows={2}
            placeholder="¿Cómo lo vas a aplicar HOY, concretamente?"
            value={sData.objetivo || ''}
            onChange={e=>update({objetivo: e.target.value})}/>
        </div>
      </div>
    </div>
  );
}

// ============== RITUALES (Pre-Venta / Pre-Grabación) ==============
function RitualView({ ritualId, state, setModule }) {
  const ritual = window.RITUALES.find(r => r.id === ritualId);
  const key = window.todayKey();
  const data = state.modules?.[key]?.[ritualId] || { pasos: {}, sesiones: 0 };
  const [step, setStep] = useStateR(0);

  const togglePaso = (n) => {
    const next = { ...(data.pasos||{}), [n]: !data.pasos?.[n] };
    setModule(key, ritualId, { ...data, pasos: next });
  };
  const completar = () => {
    setModule(key, ritualId, { ...data, pasos: {}, sesiones: (data.sesiones||0)+1 });
    setStep(0);
  };

  const allDone = ritual.pasos.every(p => data.pasos?.[p.num]);
  const totalTime = ritual.pasos.reduce((acc, p) => {
    const m = parseFloat(p.time);
    return acc + (isNaN(m) ? 0 : m);
  }, 0);
  const current = ritual.pasos[step];

  return (
    <div className="ritual-view">
      <div className="ritual-head">
        <div>
          <div className="ritual-eyebrow">RITUAL · {ritual.name.toUpperCase()}</div>
          <h2 className="ritual-title">{ritual.subtitle}</h2>
          <p className="ritual-desc">{ritual.descripcion}</p>
          <div className="ritual-vers">{ritual.versiculo}</div>
        </div>
        <div className="ritual-stats">
          <div className="rs-num">{data.sesiones || 0}</div>
          <div className="rs-label">sesiones hoy</div>
          <div className="rs-time">~{totalTime}s totales</div>
        </div>
      </div>

      <div className="ritual-stepper">
        {ritual.pasos.map((p, i) => {
          const done = !!data.pasos?.[p.num];
          return (
            <button key={p.num}
              className={`r-step ${step===i?'on':''} ${done?'done':''}`}
              onClick={()=>setStep(i)}>
              <span className="rs-num-pill">{String(p.num).padStart(2,'0')}</span>
              <span className="rs-name">{p.name}</span>
              <span className="rs-check">{done?'✓':''}</span>
            </button>
          );
        })}
      </div>

      <div className="ritual-card">
        <div className="rc-head">
          <div className="rc-num">PASO {String(current.num).padStart(2,'0')} / {ritual.pasos.length}</div>
          <h3 className="rc-title">{current.name}</h3>
          <div className="rc-time">⏱ {current.time}</div>
        </div>

        <div className="rc-block">
          <div className="rc-label">¿Por qué?</div>
          <p>{current.porque}</p>
        </div>

        <div className="rc-block accion">
          <div className="rc-label">Acción</div>
          <p>{current.accion}</p>
        </div>

        <div className="rc-block decreto">
          <div className="rc-label">Decreto en voz alta</div>
          <blockquote>"{current.decreto}"</blockquote>
        </div>

        <div className="rc-block result">
          <div className="rc-label">Resultado</div>
          <p>{current.resultado}</p>
        </div>

        <div className="rc-actions">
          <button className="step-nav-btn" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>← Anterior</button>
          <button className={`paso-check-btn ${data.pasos?.[current.num]?'done':''}`} onClick={()=>togglePaso(current.num)}>
            {data.pasos?.[current.num] ? '✓ Hecho' : 'Marcar hecho'}
          </button>
          {step < ritual.pasos.length - 1
            ? <button className="step-nav-btn primary" onClick={()=>setStep(s=>s+1)}>Siguiente →</button>
            : <button className="step-nav-btn primary" disabled={!allDone} onClick={completar}>Completar ritual ✓</button>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ReprogView, AnclasView, SombrasView, RitualView });
