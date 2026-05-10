// Vista VISUALIZACIÓN — Ambiciones y Dos Escenarios
const { useState: useStateV } = React;

function VisualView({ state, setModule }) {
  const [tab, setTab] = useStateV('escenarios');
  return (
    <div className="visual-view">
      <div className="reprog-head">
        <div className="modulo-eyebrow">VISUALIZACIÓN · MILLONARIO CONSCIENTE</div>
        <h1 className="view-title">Visualiza con los cinco sentidos</h1>
        <p className="view-sub">San Ignacio entraba a la escena con todo el cuerpo. Aquí entras a las dos vidas posibles, y al patrimonio de quien decides ser.</p>
      </div>

      <div className="sub-tabs reprog-tabs">
        <button className={`sub-tab ${tab==='escenarios'?'active':''}`} onClick={()=>setTab('escenarios')}>Dos Escenarios</button>
        <button className={`sub-tab ${tab==='ambiciones'?'active':''}`} onClick={()=>setTab('ambiciones')}>Ambiciones</button>
        <button className={`sub-tab ${tab==='diez'?'active':''}`} onClick={()=>setTab('diez')}>Top 10 Sueños</button>
        <button className={`sub-tab ${tab==='libre'?'active':''}`} onClick={()=>setTab('libre')}>Escena del día</button>
      </div>

      {tab==='escenarios' && <EscenariosView state={state} setModule={setModule}/>}
      {tab==='ambiciones' && <AmbicionesView state={state} setModule={setModule}/>}
      {tab==='diez' && <DiezView state={state} setModule={setModule}/>}
      {tab==='libre' && <EscenaDelDiaView state={state} setModule={setModule}/>}
    </div>
  );
}

function EscenariosView({ state, setModule }) {
  const [esc, setEsc] = useStateV('conversion');
  const escenario = window.ESCENARIOS[esc];
  const key = window.todayKey();
  const data = state.modules?.[key]?.escenario || {};
  const update = (patch) => setModule(key, 'escenario', { ...data, ...patch });

  return (
    <div className="escenarios-view">
      <div className="esc-toggle">
        <button className={`esc-btn ${esc==='conversion'?'on conv':''}`} onClick={()=>setEsc('conversion')}>
          <div className="eb-num">01</div>
          <div className="eb-text">El Hombre que se Convirtió</div>
          <div className="eb-sub">Cuando necesites recordar por qué empezaste</div>
        </button>
        <button className={`esc-btn ${esc==='rendido'?'on rend':''}`} onClick={()=>setEsc('rendido')}>
          <div className="eb-num">02</div>
          <div className="eb-text">Lo que Pasa si te Rindes Hoy</div>
          <div className="eb-sub">Cuando el miedo te diga "mañana"</div>
        </button>
      </div>

      <article className={`esc-doc ${esc}`} style={{'--esc-accent': escenario.accent}}>
        <header className="esc-doc-head">
          <h2>{escenario.title}</h2>
          <p className="esc-sub">{escenario.subtitle}</p>
        </header>
        <div className="esc-body">
          {escenario.parrafos.map((p, i) => <p key={i} className={i===0?'first':''}>{p}</p>)}
        </div>
      </article>

      <section className="entry-block esc-reflexion">
        <label className="entry-label">
          <span className="entry-label-num">·</span>
          <span className="entry-label-text">¿Qué se movió en ti al leerlo?</span>
        </label>
        <textarea className="entry-textarea" rows={3}
          placeholder="Una frase. Un nudo en el pecho. Una imagen que se quedó."
          value={data.reflexion || ''}
          onChange={e=>update({reflexion: e.target.value})}/>

        <label className="entry-label" style={{marginTop:24}}>
          <span className="entry-label-num">·</span>
          <span className="entry-label-text">UNA acción concreta hoy para acercarte al escenario 1</span>
        </label>
        <textarea className="entry-textarea" rows={2}
          placeholder="Algo específico, hoy. No mañana."
          value={data.accion || ''}
          onChange={e=>update({accion: e.target.value})}/>
      </section>
    </div>
  );
}

function AmbicionesView({ state, setModule }) {
  const cats = window.AMBICIONES.categorias;
  const [open, setOpen] = useStateV(cats[0].id);
  const cat = cats.find(c => c.id === open);
  const key = window.todayKey();
  const data = state.modules?.[key]?.ambicion || {};
  const update = (patch) => setModule(key, 'ambicion', { ...data, ...patch });

  return (
    <div className="ambic-view">
      <p className="anclas-intro">
        <strong>Ser → Hacer → Tener.</strong> El orden no es accidental.
        Tres pilares de cada categoría. Hoy elige UNA cosa que quieras encarnar.
      </p>

      <div className="ambic-tabs">
        {cats.map(c => (
          <button key={c.id} className={`ambic-tab ${open===c.id?'on':''}`} onClick={()=>setOpen(c.id)}>
            <span className="at-icon">{c.icon}</span>
            <span className="at-name">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="ambic-card">
        <h2 className="ambic-name"><span>{cat.icon}</span>{cat.name}</h2>
        <div className="ambic-grid">
          <div className="ambic-col ser">
            <div className="ac-label">SER</div>
            <ul>{cat.ser.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
          <div className="ambic-col hacer">
            <div className="ac-label">HACER</div>
            <ul>{cat.hacer.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
          <div className="ambic-col tener">
            <div className="ac-label">TENER</div>
            <ul>{cat.tener.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        </div>
      </div>

      <section className="entry-block">
        <label className="entry-label">
          <span className="entry-label-num">·</span>
          <span className="entry-label-text">Hoy elijo ENCARNAR…</span>
        </label>
        <textarea className="entry-textarea" rows={2}
          placeholder="Un solo Ser-Hacer-Tener de los anteriores. Hoy lo vives, aunque sea en pequeño."
          value={data.encarnar || ''}
          onChange={e=>update({encarnar: e.target.value})}/>
      </section>
    </div>
  );
}

function DiezView({ state, setModule }) {
  const items = window.AMBICIONES.diez;
  const exp = window.AMBICIONES.experiencias;
  const hab = window.AMBICIONES.habitos;
  const key = window.todayKey();
  const data = state.modules?.[key]?.diez || { activos: {}, paso: '' };
  const toggle = (i) => {
    const next = { ...(data.activos||{}), [i]: !data.activos?.[i] };
    setModule(key, 'diez', { ...data, activos: next });
  };
  return (
    <div className="diez-view">
      <p className="anclas-intro">
        Los <strong>10 sueños grandes</strong> que orientan toda decisión. Marca cuál te hace vibrar HOY.
      </p>

      <div className="diez-list">
        {items.map((t, i) => (
          <button key={i} className={`diez-row ${data.activos?.[i]?'on':''}`} onClick={()=>toggle(i)}>
            <span className="diez-num">{String(i+1).padStart(2,'0')}</span>
            <span className="diez-text">{t}</span>
            <span className="diez-check">{data.activos?.[i]?'✦':'·'}</span>
          </button>
        ))}
      </div>

      <div className="exp-grid">
        {exp.map(e => (
          <div key={e.area} className="exp-card">
            <h4>{e.area}</h4>
            <ul>{e.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="habitos-vision">
        <h4>Hábitos del Alex futuro</h4>
        <ul>{hab.map((h, i) => <li key={i}>{h}</li>)}</ul>
      </div>

      <section className="entry-block">
        <label className="entry-label">
          <span className="entry-label-num">·</span>
          <span className="entry-label-text">UN paso hoy hacia uno de esos 10 sueños</span>
        </label>
        <textarea className="entry-textarea" rows={2}
          placeholder="Concreto. Pequeño. Hoy."
          value={data.paso || ''}
          onChange={e=>setModule(key,'diez',{...data, paso: e.target.value})}/>
      </section>
    </div>
  );
}

function EscenaDelDiaView({ state, setModule }) {
  const key = window.todayKey();
  const data = state.modules?.[key]?.visual || { escena: '', vista: '', oido: '', tacto: '', olfato: '', sentir: '' };
  const update = (patch) => setModule(key, 'visual', { ...data, ...patch });

  return (
    <div className="escena-view">
      <p className="anclas-intro">
        Cierra los ojos 60 segundos antes. Entra con el cuerpo. Después escribe.
      </p>
      <section className="entry-block">
        <label className="entry-label">
          <span className="entry-label-num">01</span>
          <span className="entry-label-text">¿Qué escena vas a visualizar?</span>
        </label>
        <textarea className="entry-textarea" rows={2}
          placeholder="La oficina de Andares. La firma del primer cliente. Tu papá descansando."
          value={data.escena} onChange={e=>update({escena:e.target.value})}/>
      </section>

      <div className="sentidos-grid">
        <div className="sentido-card">
          <div className="sentido-icon">👁️</div>
          <label>Lo que ves</label>
          <textarea rows={2} value={data.vista} onChange={e=>update({vista:e.target.value})}/>
        </div>
        <div className="sentido-card">
          <div className="sentido-icon">👂</div>
          <label>Lo que oyes</label>
          <textarea rows={2} value={data.oido} onChange={e=>update({oido:e.target.value})}/>
        </div>
        <div className="sentido-card">
          <div className="sentido-icon">✋</div>
          <label>Lo que tocas / sientes en el cuerpo</label>
          <textarea rows={2} value={data.tacto} onChange={e=>update({tacto:e.target.value})}/>
        </div>
        <div className="sentido-card">
          <div className="sentido-icon">👃</div>
          <label>Lo que hueles / saboreas</label>
          <textarea rows={2} value={data.olfato} onChange={e=>update({olfato:e.target.value})}/>
        </div>
      </div>

      <section className="entry-block">
        <label className="entry-label">
          <span className="entry-label-num">02</span>
          <span className="entry-label-text">¿Qué se movió en tu corazón ahí?</span>
        </label>
        <textarea className="entry-textarea" rows={3}
          value={data.sentir} onChange={e=>update({sentir:e.target.value})}/>
      </section>
    </div>
  );
}

Object.assign(window, { VisualView });
