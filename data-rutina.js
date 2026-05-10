// Rutina diaria + tracker semanal personal de Alex Mike
window.RUTINA_DIARIA = [
  { time: "5:00",  cat: "spirit", title: "Oración",                 desc: "Total presencia, sin pensamientos invasores. Conectar con Dios, agradecer y meditar su palabra." },
  { time: "5:30",  cat: "spirit", title: "Reprogramación",          desc: "Mental con anclas y audios. Integrar sombras." },
  { time: "6:00",  cat: "body",   title: "Deporte",                 desc: "Música buena y alerta — llegar al fallo." },
  { time: "7:00",  cat: "study",  title: "Lectura",                 desc: "Total presencia, sin dormir, sin ruido — mín. 20 min." },
  { time: "7:30",  cat: "body",   title: "Ducha de agua fría",      desc: "Con motivación. Decretar programación — no negociable." },
  { time: "7:50",  cat: "body",   title: "Batido + Café + Vitamina", desc: "Plátano + avena + cacao/whey + creatina 5g." },
  { time: "8:00",  cat: "work",   title: "Deep Work — Paolandrea",  desc: "Análisis y bazar en total presencia. Agua con creatina." },
  { time: "10:00", cat: "work",   title: "Formación con David",     desc: "Shadow Operator — sin ruido, total presencia con apuntes y café." },
  { time: "11:30", cat: "work",   title: "Prospección online",      desc: "10 leads mínimo. Instagram sin distraer foco. No usar iPhone para prospectar." },
  { time: "13:00", cat: "body",   title: "Comida",                  desc: "Cocina sana — proteína + verdura + carb + creatina 5g." },
  { time: "13:50", cat: "work",   title: "Salir a calle a prospectar", desc: "Restaurantes, tiendas, clínicas B2B. Plan y propuestas en mente." },
  { time: "16:00", cat: "content",title: "Contenido Alex Mike",     desc: "Grabar, editar y subir 1 reel + 3 historias. Auténtico — no negociable." },
  { time: "17:00", cat: "study",  title: "IA Study",                desc: "Para no perder foco en la tendencia." },
  { time: "18:00", cat: "work",   title: "KPIs y seguimiento",      desc: "Medición, análisis y planificación de tareas del día siguiente." },
  { time: "18:30", cat: "study",  title: "Inglés con IA",           desc: "Total presencia sin distracciones con la IA." },
  { time: "19:00", cat: "body",   title: "Cena",                    desc: "Sana, agua abundante, podcast. Máx 3h antes de dormir." },
  { time: "19:50", cat: "spirit", title: "Misa",                    desc: "Entrega total sin pensamientos invasores." },
  { time: "21:00", cat: "rest",   title: "Daily Review",            desc: "Desconectar pantallas. Diario de Ameche. Planificar mañana." },
  { time: "21:30", cat: "spirit", title: "Agradecimiento",          desc: "Oración con Dios, la Virgen, san Miguel y el ángel de la guarda." },
  { time: "22:00", cat: "rest",   title: "Dormir",                  desc: "Entrega total — cepillado, hidratado. Apagado total." },
];

window.HABITOS_GROUPS = [
  { name: "Espíritu",  color: "#7F77DD", items: [
    { id: "h_oracion", text: "Oración 5:00 — Total presencia con Dios" },
    { id: "h_reprog",  text: "Reprogramación 5:30 — Anclas, audios y sombras" },
    { id: "h_misa",    text: "Misa 19:50 — Entrega total" },
    { id: "h_grat",    text: "Agradecimiento 21:30 — Oración nocturna" },
  ]},
  { name: "Cuerpo",    color: "#1D9E75", items: [
    { id: "h_train",   text: "Entrenamiento 6:00 — Llegar al fallo" },
    { id: "h_fria",    text: "Ducha fría 7:30 — No negociable" },
    { id: "h_agua",    text: "2+ litros de agua hoy" },
    { id: "h_batido",  text: "Batido matutino + creatina 5g" },
    { id: "h_comida",  text: "Comida 13:00 — proteína + verdura + carb" },
    { id: "h_cena",    text: "Cena ligera 19:00 — máx 3h antes dormir" },
  ]},
  { name: "Negocio",   color: "#378ADD", items: [
    { id: "h_deep",    text: "Deep Work — Paolandrea" },
    { id: "h_david",   text: "Formación con David" },
    { id: "h_pros10",  text: "10 prospectos online (mínimo)" },
    { id: "h_calle",   text: "Salir a la calle a prospectar B2B" },
    { id: "h_kpi",     text: "KPIs y seguimiento" },
  ]},
  { name: "Contenido", color: "#D85A30", items: [
    { id: "h_reel",    text: "1 reel grabado, editado y subido" },
    { id: "h_hist",    text: "3 historias auténticas" },
  ]},
  { name: "Estudio",   color: "#BA7517", items: [
    { id: "h_lect",    text: "Lectura 7:00 — mín 20 min" },
    { id: "h_ia",      text: "IA Study 17:00" },
    { id: "h_eng",     text: "Inglés con IA 18:30" },
  ]},
  { name: "Descanso",  color: "#888780", items: [
    { id: "h_review",  text: "Daily Review 21:00" },
    { id: "h_dormir",  text: "Dormir 22:00 (8h)" },
  ]},
];

window.NUTRICION = {
  batido: { time: "7:50 — siempre igual", name: "Batido de plátano, avena y proteína", desc: "1 plátano maduro · 4–5 cdas avena entera · 1 cda cacao puro o whey · 200 ml agua fría · 5g creatina · café en la mañana aparte", macros: ["Proteína ~30–45g", "Carbos ~42g", "Kcal ~350–390"] },
  comida: { time: "13:00", name: "Pechuga / muslo / pescado", desc: "150–200g proteína a la plancha · arroz integral o frijoles · ensalada con AOVE y limón · tortilla de maíz (máx 2) · aguacate", macros: ["Proteína ~35–45g", "Verdura siempre", "Creatina 5g"] },
  cena:   { time: "19:00 — máx 3h antes de dormir", name: "Cena ligera con agua", desc: "Huevo revuelto / ensalada de jícama + pepino + limón / verduras al comal / sopa · 500 ml agua · podcast · sin pantallas post-cena", macros: ["Ligera 200–300 kcal", "Sin carbos pesados"] },
  variantes: [
    "Lu: pollo + arroz integral + espinacas",
    "Ma: pescado blanco + ensalada de berros + tortilla",
    "Mi: atún en agua + frijoles + aguacate",
    "Ju: huevo (3–4) + nopales + salsa roja",
    "Vi: muslo de pollo + arroz + ensalada verde",
    "Sa: atún o filete + verduras al comal"
  ]
};

window.DEPORTE_SEMANA = [
  { day: "Lunes",     tag: "Fuerza",  name: "Pecho y tríceps",    items: ["Press banca o flexiones", "Press inclinado", "Fondos de tríceps", "Fondos en paralelas", "Elevaciones laterales", "Llegar al fallo"] },
  { day: "Martes",    tag: "Fuerza",  name: "Espalda y bíceps",   items: ["Dominadas (todas las que puedas)", "Remo con mancuerna", "Jalones", "Curl de bíceps", "Peso muerto ligero"] },
  { day: "Miércoles", tag: "Cardio",  name: "Cardio y core",      items: ["Correr 20–30 min o saltar cuerda", "Plancha 3x60s", "Abdominales", "Estiramiento general"] },
  { day: "Jueves",    tag: "Fuerza",  name: "Pierna y glúteo",    items: ["Sentadilla con peso o bodyweight", "Zancadas", "Puente de glúteo", "Calf raises", "Sentadilla búlgara"] },
  { day: "Viernes",   tag: "Fuerza",  name: "Hombro y core",      items: ["Press militar", "Elevaciones frontales y laterales", "Remo al mentón", "Plancha lateral", "Abdominales oblicuos"] },
  { day: "Sábado",    tag: "Cardio",  name: "Actividad ligera",   items: ["Caminata activa", "Movilidad y estiramiento", "Sin alta intensidad"] },
  { day: "Domingo",   tag: "Descanso",name: "Recuperación total", items: ["Sin entrenamiento estructurado", "Caminata opcional", "Foco en sueño y recuperación", "Misa y reflexión"] },
];

window.SUPLEMENTOS = [
  { name: "Creatina monohidrato — 5g", timing: "Batido matutino + 5g en comida del mediodía. Total 10g/día." },
  { name: "Vitamina Veroca",          timing: "Con el batido matutino — 7:50 am siempre." },
  { name: "Omega 3 (DHA/EPA)",        timing: "Con el batido o con la comida — 1–2 cápsulas." },
  { name: "Café — 1 taza",            timing: "Solo en la mañana. Jamás después de las 14:00." },
  { name: "Té manzanilla / jamaica / jengibre", timing: "Noche — alternativa al café. Baja cortisol." },
];
