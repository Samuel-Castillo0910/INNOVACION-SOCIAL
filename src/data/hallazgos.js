// datos de la pagina lo que encontramos
// la auditoria sale del documento auditoria de manuales de convivencia v2 del equipo
// las citas de las normas son textuales, el por que importa es un resumen sencillo del analisis

export const manuales = [
  { nombre: 'Liceo Campestre de Pereira', detalle: 'Pereira, versión 15, 2025-2026' },
  { nombre: 'Institución Educativa Técnico Industrial Santiago de Arma (IETISA)', detalle: 'Rionegro, Antioquia' },
  { nombre: 'Colegio Seminario Corazonista', detalle: 'Marinilla, Antioquia, 2016' },
]

// los cuatro focos de la auditoria, la agrupacion de cada norma la hizo el equipo
export const focos = [
  { id: 'forma', nombre: 'Juzgan actitudes o la forma de ser', corto: 'Juzgan la forma de ser' },
  { id: 'intimidad', nombre: 'Se meten con el afecto, la intimidad o la vida fuera del colegio', corto: 'Afecto, intimidad y vida privada' },
  { id: 'expresion', nombre: 'Limitan la expresión y el libre desarrollo', corto: 'Expresión y libre desarrollo' },
  { id: 'culpa', nombre: 'Parten de que el estudiante miente', corto: 'Presumen la culpa' },
]

export const normas = [
  {
    colegio: 'Liceo Campestre de Pereira',
    donde: 'Artículo 30, numeral 17',
    cita: 'Asumir actitudes que impidan el normal desarrollo de la clase y actos culturales.',
    porque: '"Actitudes" puede ser casi cualquier cosa: cansancio, desánimo o estar distraído. Se sanciona un estado de ánimo en vez de preguntar qué hay detrás.',
    foco: 'forma',
  },
  {
    colegio: 'IETISA, Rionegro',
    donde: 'Deberes del estudiante, numeral 29',
    cita: 'No ejercer influencias negativas en los compañeros, inducirlos al consumo de drogas u otra conducta de riesgo, a no asistir a clase, a perder y hacer perder tiempo y otras faltas establecidas en el presente Manual.',
    porque: 'No dice qué es una "influencia negativa". Permite señalar a un estudiante como "mala influencia" por quién es y no por algo concreto que hizo.',
    foco: 'forma',
  },
  {
    colegio: 'IETISA, Rionegro',
    donde: 'Deberes del estudiante, numeral 25',
    cita: 'Utilizar en todo momento y con todas las personas un vocabulario respetuoso, apropiado y culto; saludando, pidiendo permiso, presentando excusas y despidiéndose con educación y cortesía.',
    porque: 'Exigir un vocabulario "culto" puede volver falta una forma de hablar, un acento o un momento de rabia, en vez de atender la emoción o el conflicto.',
    foco: 'forma',
  },
  {
    colegio: 'Colegio Seminario Corazonista',
    donde: 'Artículo 66, numeral 39, y artículo 68, numeral 37',
    cita: 'Todo acto contra la moral, la filosofía del colegio, la ley y las buenas costumbres / Todo acto contra la moral cristiana y las buenas costumbres.',
    porque: 'Una falta grave debería decir qué conducta está prohibida. "La moral cristiana" es tan amplia que permite sancionar ideas o creencias.',
    foco: 'forma',
  },
  {
    colegio: 'Liceo Campestre de Pereira',
    donde: 'Artículo 30, numeral 22',
    cita: 'Realizar demostraciones de afecto, amorosas y/o de contacto físico inapropiadas.',
    porque: 'No dice qué es "inapropiado", así que depende de quién lo juzgue. Puede castigar muestras de cariño normales entre jóvenes.',
    foco: 'intimidad',
  },
  {
    colegio: 'Liceo Campestre de Pereira',
    donde: 'Artículo 31, numeral 15',
    cita: 'Incurrir en comportamientos que atenten contra la moral, la dignidad, el respeto y las buenas costumbres, tanto dentro como fuera del colegio (...)',
    porque: '"La moral" y "las buenas costumbres" no dicen qué conducta está prohibida, y la norma llega hasta la vida del estudiante fuera del colegio.',
    foco: 'intimidad',
  },
  {
    colegio: 'Colegio Seminario Corazonista',
    donde: 'Artículo 25, literal cc, y artículo 66, numeral 34',
    cita: 'Abstenerse de manifestar expresiones afectivas exageradas con sus compañeros y profesores / Tener actitudes, gestos, comportamientos eróticos o expresiones inadecuadas de afecto dentro de la institución.',
    porque: 'Qué es "exagerado" o "inadecuado" queda a criterio de cada docente. Se puede castigar el afecto de todos los días.',
    foco: 'intimidad',
  },
  {
    colegio: 'Colegio Seminario Corazonista',
    donde: 'Artículo 25, literal bb, y artículo 66, numeral 28',
    cita: 'Comportarse fuera del establecimiento en correspondencia con los principios de la Institución, con la buena educación y las buenas maneras (...) / Permanecer con el uniforme de la institución en jornada contraria a la escolar en lugares públicos como bares, discotecas, teatros entre otros.',
    porque: 'Sanciona lo que el estudiante hace fuera del colegio y pone los teatros al mismo nivel que los bares.',
    foco: 'intimidad',
  },
  {
    colegio: 'Colegio Seminario Corazonista',
    donde: 'Artículo 6, pautas de presentación personal',
    cita: 'Hombres: La presentación personal debe ser con cabello corto, sin exageraciones, corte tradicional sin "hongo", ni "punk", ni "metalero", ni cualquier otra moda extravagante (...), sin barba, sin bigote, sin patilla y no usar tinturas, gel, gominas, fijadores para el cabello (...). Mujeres: (...) no usar ningún tipo de maquillaje (...)',
    porque: 'Decide cómo debe verse cada estudiante. Según nuestro análisis, va en contra de lo que ha dicho la Corte Constitucional sobre el libre desarrollo de la personalidad.',
    foco: 'expresion',
  },
  {
    colegio: 'IETISA, Rionegro',
    donde: 'Deberes del estudiante, numeral 38',
    cita: 'Aprovechar el tiempo de descanso para la sana recreación en los espacios dispuestos para ello y abstenerse de permanecer en los sitios no habilitados para tal efecto.',
    porque: 'Le dice al estudiante cómo descansar. Le quita la opción de estar solo o de compartir a su manera en las pausas.',
    foco: 'expresion',
  },
  {
    colegio: 'IETISA, Rionegro',
    donde: 'Deberes del estudiante, numeral 28',
    cita: 'Abstenerse de traer a la institución implementos como balones, patinetas, bates u otros que alteren la armonía escolar. La institución no se hace responsable de los daños, pérdidas y accidentes ocasionados con éstos.',
    porque: 'Limita el juego y el movimiento en el descanso, que también sirven para despejarse.',
    foco: 'expresion',
  },
  {
    colegio: 'Liceo Campestre de Pereira',
    donde: 'Artículo 30, numeral 6',
    cita: 'Faltas a la verdad, para encubrir o excusar sus actuaciones o las de sus compañeros.',
    porque: 'Llamar "falta a la verdad" a la versión de un estudiante parte de que miente. Así es difícil que explique lo que de verdad le pasó.',
    foco: 'culpa',
  },
]

// resultados del formulario de 9 personas, contados a partir de data/testimonios.js
export const resultadosFormulario = [
  { valor: 6, texto: 'sintieron que el colegio las describía por sus acciones y no por una etiqueta.' },
  { valor: 3, texto: 'sintieron que, en un problema disciplinario, el colegio las juzgó por cómo creía que eran.' },
  { valor: 3, texto: 'sintieron que los profesores o coordinadores las escuchaban para conocerlas y cuidarlas.' },
  { valor: 4, texto: 'vieron a algún compañero tratado de perezoso o desinteresado.' },
]
