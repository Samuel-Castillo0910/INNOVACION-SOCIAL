// revision de lo que alguien va a publicar o comentar, antes de enviarlo
// los insultos son los mismos que revisa supabase en texto_permitido, si se cambia uno hay que cambiar el otro
// se puede criticar una norma o un colegio, lo que no pasa son los insultos

const DE = 'áéíóúüñàèìòùÁÉÍÓÚÜÑ0134@$'
const A = 'aeiouunaeiouaeiouunoieaas'

// minuscula, sin tildes, numeros cambiados por letras y sin letras repetidas tres o mas veces
function limpiar(texto) {
  let x = ''
  for (const letra of (texto || '').toLowerCase()) {
    const i = DE.indexOf(letra)
    x += i >= 0 ? A[i] : letra
  }
  return x.replace(/(.)\1\1+/g, '$1')
}

const INSULTOS =
  /\b(hijueputas?|hijos? de (su )?puta|h\W?p|jueputa|gonorreas?|malparid[oa]s?|carechimbas?|pirob[oa]s?|(guevon|huevon|webon|huebon|guebon)(a|es|as)?|idiotas?|imbecil(es)?|estupid[oa]s?|pendej[oa]s?|perras?|zorras?|putas?|maricas?|maricon(es)?|mongolic[oa]s?|subnormal(es)?|malnacid[oa]s?)\b/

const CONTRA_INSTITUCIONES =
  /\b(colegio|profes?|profesor(a|es|as)?|rector(a|es|as)?|coordinador(a|es|as)?|directiv[oa]s?|institucion(es)?|monjas?|curas?)\s+(de\s+|(es|era|son|eran)\s+(una?\s+)?)mierda\b/

// nombres de colegios o de personas, se busca en el texto original porque importan las mayusculas
const NOMBRES =
  /\b(?:[Cc]olegio|[Ii]nstituto|[Ii]nstituci[oó]n|[Ll]iceo|[Gg]imnasio|[Ee]scuela|[Ss]eminario|[Pp]rofe|[Pp]rofesora?|[Rr]ectora?|[Cc]oordinadora?|[Pp]sic[oó]log[oa]|[Hh]ermana|[Hh]ermano|[Pp]adre)\s+(?:de\s+(?:la\s+|los\s+)?)?(?!(?:Cat[oó]lic[oa]|Privad[oa]|P[uú]blic[oa]|Mixt[oa]|Biling[uü]e|Femenin[oa]|Masculin[oa])\b)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/

// frases que suenan a riesgo, no se bloquean, solo se muestran las lineas de ayuda
const RIESGO =
  /\b(suicid\w*|matarme|me quiero matar|quitarme la vida|acabar con mi vida|no quiero (seguir )?viv(ir|iendo)|mejor muert[oa]|quiero morir(me)?|me quiero morir|hacerme da[nñ]o|cortarme|autolesi\w*|quiero desaparecer|no vale la pena vivir)\b/

export const MENSAJE_INSULTO =
  'Tu mensaje tiene un insulto o una palabra ofensiva, así que no se puede publicar. Aquí se puede criticar una norma, a un profesor o a un colegio, pero sin insultar. Si estás contando algo que te dijeron, escribe la palabra con asteriscos, por ejemplo i***ta.'

// devuelve el motivo para no publicar, o null si se puede, y si conviene mostrar las lineas de ayuda
export function revisar(texto) {
  const limpio = limpiar(texto)
  let bloqueo = null
  if (INSULTOS.test(limpio) || CONTRA_INSTITUCIONES.test(limpio)) {
    bloqueo = MENSAJE_INSULTO
  } else {
    const nombre = (texto || '').match(NOMBRES)
    if (nombre) {
      bloqueo = `Parece que escribiste el nombre de un colegio o de una persona («${nombre[0]}»). En el foro no se usan nombres reales: escribe, por ejemplo, «mi colegio» o «un profesor».`
    }
  }
  return { bloqueo, riesgo: RIESGO.test(limpio) }
}

// supabase responde 42501 cuando una regla de la base no deja guardar, casi siempre por un insulto
export const esRechazoPorNormas = (error) => error?.code === '42501'
