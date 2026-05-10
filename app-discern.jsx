// Vista de Caminos (los 10 personajes bíblicos)
const { useState: useStateC, useEffect: useEffectC } = React;

function CaminosView({ state, setCamino }) {
  const [open, setOpen] = useStateC(state.currentCamino);
  useEffectC(() => setOpen(state.currentCamino), [state.currentCamino]);
  const camino = window.CAMINOS[open];

  return (
    <div className="caminos-view">
      <h1 className="view-title">Los diez caminos</h1>
      <p className="view-sub">Diez personajes bíblicos que iluminan el discernimiento. Elige uno como compañero de la semana.</p>

      <div className="caminos-list">
        {window.CAMINOS.map((c, i) => (
          <button
            key={c.id}
            className={`camino-row ${i===open?'open':''} ${i===state.currentCamino?'is-current':''}`}
            style={{'--accent': c.color}}
            onClick={() => setOpen(i)}
          >
            <div className="row-num">{String(c.numero).padStart(2,'0')}</div>
            <div className="row-text">
              <div className="row-name">{c.nombre}</div>
              <div className="row-sub">{c.subtitulo}</div>
            </div>
            {i === state.currentCamino && <div className="row-badge">activo</div>}
          </button>
        ))}
      </div>

      {camino && (
        <div className="camino-detail" style={{'--accent': camino.color}}>
          <div className="detail-top">
            <div>
              <div className="d-eyebrow">El camino de</div>
              <h2 className="d-name">{camino.nombre}</h2>
              <div className="d-sub">{camino.subtitulo}</div>
            </div>
            <button
              className={`set-current-btn ${open===state.currentCamino?'is-current':''}`}
              onClick={() => setCamino(open)}
              disabled={open===state.currentCamino}
            >
              {open===state.currentCamino ? '✓ Caminando aquí' : 'Caminar esta semana'}
            </button>
          </div>

          <blockquote className="d-vers">{camino.versiculo}</blockquote>

          <section className="liturgia-block">
            <div className="liturgia-line">{camino.entrada}</div>
          </section>

          <section>
            <h4>Oración inicial</h4>
            <p className="d-oracion">{camino.oracionInicial}</p>
          </section>

          <section>
            <h4>Introducción</h4>
            <p>{camino.introduccion}</p>
          </section>

          <section>
            <h4>La historia</h4>
            <p style={{whiteSpace:'pre-line'}}>{camino.historia}</p>
          </section>

          <section>
            <h4>Aplicación</h4>
            <p style={{whiteSpace:'pre-line'}}>{camino.aplicacion}</p>
          </section>

          {camino.id === 'elias' && window.REGLAS_ELIAS && (
            <section>
              <h4>Las 6 reglas del discernimiento</h4>
              <div className="reglas-grid">
                {window.REGLAS_ELIAS.map(r => (
                  <div key={r.num} className="regla-card">
                    <div className="regla-num">Regla {r.num}</div>
                    <div className="regla-titulo">{r.titulo}</div>
                    <div className="regla-texto">{r.texto}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h4>Tu ejercicio esta semana</h4>
            <div className="d-ejercicio" style={{whiteSpace:'pre-line'}}>{camino.ejercicio}</div>
          </section>

          {camino.preguntas && camino.preguntas.length > 0 && (
            <section>
              <h4>Preguntas para la semana</h4>
              <ol className="d-preguntas">
                {camino.preguntas.map((p, i) => <li key={i}>{p}</li>)}
              </ol>
            </section>
          )}

          <section>
            <h4>{camino.salmoNombre || 'Salmo'}</h4>
            <p className="d-salmo" style={{whiteSpace:'pre-line'}}>{camino.salmo}</p>
          </section>

          <section>
            <h4>Oración final</h4>
            <p className="d-oracion">{camino.oracionFinal}</p>
          </section>

          <section className="pdf-link-block">
            <a className="pdf-link"
              href={`como-escuchar-al-espiritu.pdf${camino.pdfPage ? '#page='+camino.pdfPage : ''}`}
              target="_blank" rel="noopener">
              📖 Abrir el texto original del libro {camino.pdfPage ? `(p. ${camino.pdfPage})` : ''}
            </a>
            <p className="pdf-hint">Para leer el desarrollo completo de este camino tal como lo escribió Guillermo Ameche.</p>
          </section>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CaminosView });
