// Vista DAILY HUB — Diario, Semana, Resumen, Discernir, Modo Monje
const { useState: useStateDH, useMemo: useMemoDH } = React;

function DailyHub({ state, setEntry, setModule, camino }) {
  const [tab, setTab] = useStateDH('hoy');
  return (
    <div className="daily-hub">
      <div className="sub-tabs">
        <button className={`sub-tab ${tab==='hoy'?'active':''}`} onClick={()=>setTab('hoy')}>Hoy</button>
        <button className={`sub-tab ${tab==='semana'?'active':''}`} onClick={()=>setTab('semana')}>Esta semana</button>
        <button className={`sub-tab ${tab==='resumen'?'active':''}`} onClick={()=>setTab('resumen')}>Resumen</button>
        <button className={`sub-tab ${tab==='discernir'?'active':''}`} onClick={()=>setTab('discernir')}>Discernir</button>
        <button className={`sub-tab ${tab==='monje'?'active':''}`} onClick={()=>setTab('monje')}>Modo Monje</button>
      </div>
      {tab==='hoy' && <window.HoyView state={state} setEntry={setEntry} camino={camino}/>}
      {tab==='semana' && <window.SemanaView state={state} setEntry={setEntry}/>}
      {tab==='resumen' && <window.ResumenView state={state}/>}
      {tab==='discernir' && <window._OldDiscernirView state={state}/>}
      {tab==='monje' && <ModoMonjeView state={state} setModule={setModule}/>}
    </div>
  );
}

function ModoMonjeView({ state, setModule }) {
  const directivas = window.DIRECTIVAS_MONJE;
  const cats = window.MONJE_CATEGORIES;
  const [filter, setFilter] = useStateDH('all');
  const key = window.todayKey();
  const data = state.modules?.[key]?.monje || { directivaDelDia: null, reflexion: '' };

  // Directiva del día — determinística por fecha
  const dailyIdx = useMemoDH(() => {
    const k = key.replace(/-/g, '');
    return parseInt(k) % directivas.length;
  }, [key]);
  const directivaDia = directivas[dailyIdx];

  const lista = filter === 'all' ? directivas : directivas.filter(d => d.cat === filter);
  const update = (patch) => setModule(key, 'monje', { ...data, ...patch });
  const setActiva = (id) => update({ directivaDelDia: id });

  return (
    <div className="monje-view">
      <div className="monje-head">
        <div className="modulo-eyebrow">MODO MONJE · 100 DIRECTIVAS</div>
        <h2 className="monje-title">Disciplina monástica para construir un imperio</h2>
        <p className="monje-sub">Cien órdenes que sigues sin discutir. Hoy se te asigna una al azar — pero puedes elegir otra si tu día lo pide.</p>
      </div>

      <div className="directiva-dia" style={{'--md': '#c97b50'}}>
        <div className="dd-eyebrow">Directiva del día · {String(directivaDia.id).padStart(3,'0')}</div>
        <div className="dd-cat">{directivaDia.cat}</div>
        <h3 className="dd-title">{directivaDia.title}</h3>
        <p className="dd-body">{directivaDia.body}</p>
        <button
          className={`dd-encarnar ${data.directivaDelDia===directivaDia.id?'on':''}`}
          onClick={()=>setActiva(directivaDia.id)}>
          {data.directivaDelDia===directivaDia.id ? '✓ La encarnaré hoy' : 'Encarnar hoy'}
        </button>
      </div>

      <section className="entry-block">
        <label className="entry-label">
          <span className="entry-label-num">·</span>
          <span className="entry-label-text">¿Cómo la vas a aplicar HOY?</span>
        </label>
        <textarea className="entry-textarea" rows={3}
          placeholder="Una acción concreta que demuestre que entendiste."
          value={data.reflexion || ''}
          onChange={e=>update({reflexion: e.target.value})}/>
      </section>

      <h3 className="monje-list-h">Las 100 directivas</h3>

      <div className="monje-filter">
        <button className={`mf ${filter==='all'?'on':''}`} onClick={()=>setFilter('all')}>Todas</button>
        {cats.map(c => (
          <button key={c} className={`mf ${filter===c?'on':''}`} onClick={()=>setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="monje-grid">
        {lista.map(d => (
          <button key={d.id}
            className={`monje-card ${data.directivaDelDia===d.id?'active':''}`}
            onClick={()=>setActiva(d.id)}>
            <div className="mc-num">{String(d.id).padStart(3,'0')}</div>
            <div className="mc-cat">{d.cat}</div>
            <div className="mc-title">{d.title}</div>
            <div className="mc-body">{d.body}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { DailyHub, ModoMonjeView });
