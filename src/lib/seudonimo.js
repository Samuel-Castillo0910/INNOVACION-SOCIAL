// arma seudonimos inventados como "Colibri Indigo 47", los colores no cambian con el genero

const nombres = [
  'Colibrí', 'Guacamaya', 'Ceiba', 'Barranquero', 'Turpial', 'Cóndor', 'Tucán', 'Jaguar', 'Frailejón', 'Orquídea',
  'Guayacán', 'Mariposa', 'Búho', 'Delfín', 'Nutria', 'Zorro', 'Halcón', 'Tortuga', 'Ardilla', 'Luciérnaga',
]
const colores = ['Azul', 'Verde', 'Gris', 'Índigo', 'Turquesa', 'Violeta', 'Naranja', 'Ocre', 'Coral', 'Celeste', 'Marfil', 'Cian']

const alAzar = (lista) => lista[Math.floor(Math.random() * lista.length)]

export function seudonimoAlAzar() {
  return `${alAzar(nombres)} ${alAzar(colores)} ${10 + Math.floor(Math.random() * 90)}`
}
