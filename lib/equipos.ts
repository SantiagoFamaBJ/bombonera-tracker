import { normalizarTexto } from './texto'

// Nombre con el que se guarda y se muestra  →  otras formas en las que lo podés escribir.
// Tildes, mayúsculas, puntos y apóstrofes no hace falta listarlos: ya se ignoran
// ("Vélez" = "velez", "Newell's" = "Newells").
// Si aparece un equipo nuevo con dos nombres, se suma acá o se une a mano desde H2H → UNIR EQUIPOS.
const EQUIPOS: Record<string, string[]> = {
  'River': ['river plate', 'club atletico river plate', 'ca river plate', 'river plate (arg)'],
  'Velez': ['velez sarsfield', 'velez sarfield', 'club atletico velez sarsfield', 'velez sarsfield (arg)'],
  'Newells': ['newells old boys', 'newells old boys (rosario)', 'newells rosario'],
  'Racing': ['racing club', 'racing club de avellaneda', 'racing de avellaneda', 'racing (avellaneda)'],
  'Independiente': ['independiente de avellaneda', 'independiente avellaneda', 'independiente (avellaneda)', 'club atletico independiente', 'ca independiente'],
  'San Lorenzo': ['san lorenzo de almagro', 'club atletico san lorenzo de almagro'],
  'Estudiantes': ['estudiantes de la plata', 'estudiantes la plata', 'estudiantes lp', 'estudiantes (lp)'],
  'Gimnasia': ['gimnasia la plata', 'gimnasia y esgrima la plata', 'gimnasia y esgrima de la plata', 'gimnasia lp', 'gimnasia (lp)', 'gimnasia de la plata'],
  'Gimnasia (MZA)': ['gimnasia mza', 'gimnasia mendoza', 'gimnasia y esgrima mendoza', 'gimnasia y esgrima de mendoza', 'gimnasia (mendoza)', 'gimnasia de mendoza', 'gimnasia y esgrima (mza)'],
  'Lanús': ['club atletico lanus', 'ca lanus', 'lanus (arg)'],
  'Banfield': ['club atletico banfield', 'ca banfield'],
  'Huracán': ['club atletico huracan', 'ca huracan'],
  'Argentinos': ['argentinos juniors', 'argentinos jrs', 'argentinos jr', 'asociacion atletica argentinos juniors'],
  'Talleres': ['talleres de cordoba', 'talleres cordoba', 'talleres (c)', 'talleres (cba)', 'club atletico talleres'],
  'Belgrano': ['belgrano de cordoba', 'belgrano cordoba', 'belgrano (cba)', 'club atletico belgrano'],
  'Instituto': ['instituto de cordoba', 'instituto ac de cordoba', 'instituto atletico central cordoba', 'instituto (cba)', 'iacc', 'instituto cordoba'],
  'Rosario Central': ['club atletico rosario central', 'ca rosario central', 'central rosario'],
  'Central Córdoba': ['central cordoba sde', 'central cordoba (sde)', 'central cordoba de santiago del estero', 'central cordoba santiago del estero', 'central cordoba (se)'],
  'Atlético Tucumán': ['club atletico tucuman', 'atl tucuman', 'at tucuman', 'atletico de tucuman'],
  'Colón': ['colon de santa fe', 'colon sf', 'colon (sf)', 'club atletico colon'],
  'Unión': ['union de santa fe', 'union sf', 'union (sf)', 'union santa fe', 'club atletico union'],
  'Godoy Cruz': ['godoy cruz antonio tomba', 'club deportivo godoy cruz antonio tomba', 'cd godoy cruz', 'godoy cruz (mza)'],
  'Independiente Rivadavia': ['independiente rivadavia de mendoza', 'independiente rivadavia mendoza', 'independiente rivadavia (mza)', 'ind rivadavia', 'club sportivo independiente rivadavia'],
  'Defensa y Justicia': ['defensa', 'defensa & justicia', 'defensa y justicia (arg)'],
  'Tigre': ['club atletico tigre', 'ca tigre'],
  'Platense': ['club atletico platense', 'ca platense'],
  'Arsenal': ['arsenal de sarandi', 'arsenal sarandi', 'arsenal fc', 'arsenal (sarandi)'],
  'Sarmiento': ['sarmiento de junin', 'sarmiento junin', 'sarmiento (junin)', 'club atletico sarmiento'],
  'Barracas': ['barracas central', 'club atletico barracas central', 'barracas c'],
  'Riestra': ['deportivo riestra', 'club deportivo riestra', 'dep riestra', 'cd riestra'],
  'Aldosivi': ['club atletico aldosivi', 'ca aldosivi', 'aldosivi (mdp)'],
  'Patronato': ['patronato de parana', 'patronato (parana)', 'club atletico patronato', 'patronato de la juventud catolica'],
  'Temperley': ['club atletico temperley'],
  'San Martín de SJ': ['san martin sj', 'san martin de san juan', 'san martin (sj)', 'san martin san juan'],
  // Internacionales
  'Palmeiras': ['se palmeiras', 'sociedade esportiva palmeiras', 'palmeiras (bra)', 'palmeiras sp'],
  'Corinthians': ['sc corinthians', 'sport club corinthians paulista', 'corinthians (bra)', 'corinthians sp'],
  'Cruzeiro': ['cruzeiro ec', 'cruzeiro esporte clube', 'cruzeiro (bra)'],
  'Fortaleza': ['fortaleza ec', 'fortaleza esporte clube', 'fortaleza (bra)'],
  'Atlético Paranaense': ['athletico paranaense', 'athletico pr', 'athletico-pr', 'atletico pr', 'atletico-pr', 'club athletico paranaense', 'atletico paranaense (bra)', 'athletico paranaense (bra)'],
  'Alianza Lima': ['club alianza lima', 'alianza lima (per)', 'ca alianza lima'],
  'Libertad': ['club libertad', 'libertad de asuncion', 'libertad asuncion', 'libertad (par)'],
  'Trinidense': ['sportivo trinidense', 'club sportivo trinidense', 'trinidense (par)'],
  'Junior': ['junior de barranquilla', 'junior barranquilla', 'atletico junior', 'junior (col)'],
  'Deportes Tolima': ['tolima', 'club deportes tolima', 'deportes tolima (col)'],
  'Deportivo Medellín': ['independiente medellin', 'deportivo independiente medellin', 'dim', 'deportivo medellin (col)'],
  'Deportivo Cali': ['asociacion deportivo cali', 'deportivo cali (col)'],
  'Deportivo Pereira': ['pereira', 'deportivo pereira (col)'],
  'Jorge Wilstermann': ['wilstermann', 'jorge wilsterman', 'wilsterman', 'club deportivo jorge wilstermann', 'jorge wilstermann (bol)'],
  'Always Ready': ['club always ready', 'always ready (bol)'],
  'Nacional de Potosí': ['nacional potosi', 'club nacional potosi', 'nacional (bol)'],
  'Nacional': ['nacional de montevideo', 'nacional montevideo', 'nacional (uru)', 'nacional uruguay', 'club nacional de football'],
  'Liga de Quito': ['ldu', 'ldu quito', 'ldu de quito', 'liga deportiva universitaria', 'liga deportiva universitaria de quito', 'liga quito', 'liga de quito (ecu)'],
  'Independiente del Valle': ['independiente del valle (ecu)', 'independiente del valle ecuador', 'independiente valle', 'idv'],
  'Barcelona (Guayaquil)': ['barcelona sc', 'barcelona de guayaquil', 'barcelona guayaquil', 'barcelona (ecu)', 'barcelona sporting club', 'barcelona ecuador'],
  'Colo-Colo': ['colo colo', 'colocolo', 'club social y deportivo colo-colo', 'colo-colo (chi)'],
  'Universidad Católica': ['u catolica', 'universidad catolica de chile', 'universidad catolica chile', 'universidad catolica (chile)', 'u catolica (chile)', 'la catolica'],
  'Monagas': ['monagas sc', 'monagas sport club', 'monagas (ven)'],
}

const ALIAS = new Map<string, string>()
Object.keys(EQUIPOS).forEach(canonico => {
  ALIAS.set(normalizarTexto(canonico), canonico)
  EQUIPOS[canonico].forEach(a => ALIAS.set(normalizarTexto(a), canonico))
})

// Sugerencias para el campo "Rival" del formulario
export const NOMBRES_EQUIPOS = Object.keys(EQUIPOS).sort((a, b) => a.localeCompare(b, 'es'))

// "River Plate" → "River". Si el nombre no está en el diccionario, queda tal cual (sin espacios de más).
export function canonicalizarRival(nombre: string): string {
  const limpio = nombre.trim().replace(/\s+/g, ' ')
  return ALIAS.get(normalizarTexto(limpio)) ?? limpio
}
