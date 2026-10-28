# LOSS OF OTHERNESS

**Página en línea:** [loss-of-otherness.vercel.app](https://loss-of-otherness.vercel.app)

Plataforma web para el proyecto de innovación social sobre la **pérdida de la otredad en las comunidades escolares**. Es una red de apoyo anónima, hecha por estudiantes para estudiantes, donde quienes cargan con una etiqueta del colegio pueden contar su historia, leer a otros que vivieron algo parecido y encontrar ayuda profesional gratuita si la necesitan.

> “Que ningún estudiante tenga que cargar solo con una etiqueta.”

Proyecto de Innovación Social, Universidad EIA.

---

## El problema

Los estudiantes de 10° y 11° de colegios privados católicos de Medellín muchas veces reciben etiquetas como "perezoso", "desinteresado" o "problemático", y con el tiempo esas etiquetas se vuelven parte de cómo se ven a sí mismos. La mayoría no tiene un lugar seguro para hablar de eso: en nuestra encuesta, solo 3 de 9 personas sintieron que en el colegio las escuchaban para conocerlas y cuidarlas.

Cuando un colegio pasa de describir lo que alguien hizo a decidir quién es, se pierde la mirada sobre la persona: eso es lo que llamamos pérdida de la otredad. La encuesta también nos mostró que esto no pasa en todos los casos (6 de 9 personas sintieron que las describían por sus acciones), y por eso enfocamos la página en que nadie cargue solo con una etiqueta.

## Qué busca la página

- **Acompañar:** que un estudiante lea a otros que vivieron algo parecido y sepa que no es el único.
- **Escuchar** a quienes vivieron el colegio, de forma anónima y segura.
- **Conectar con ayuda real:** las líneas gratuitas de salud mental de Medellín y Antioquia están visibles en el foro.
- **Llegar a los adultos:** un resumen sin nombres para docentes y familias, con ideas para escuchar antes de juzgar.

## Secciones

| Página | Qué tiene |
| --- | --- |
| **Inicio** | Bienvenida, lo que ofrece la red, tres testimonios ilustrativos y la encuesta. |
| **Historias** | Los testimonios del formulario, el foro de la comunidad y las líneas de ayuda. |
| **Hallazgos** | La auditoría de 12 normas de tres manuales de convivencia, los resultados de la encuesta y lo que aprendimos. |
| **Docentes y familias** | Resumen sin nombres armado con los datos del foro y cinco ideas para escuchar mejor. Se puede imprimir. |
| **Misión** | Misión y visión del proyecto. |
| **Privacidad** | Cómo se protege la identidad de quienes participan. |
| **Iniciar sesión / Registrarse** | Cuentas con seudónimo para participar en el foro. |

## Testimonios

- **Del formulario:** 9 personas respondieron de forma anónima un formulario entre el 1 y el 7 de octubre de 2026. Las respuestas de cada persona se juntaron en un solo texto en primera persona, con el seudónimo que cada una eligió y sin agregar información.
- **Ilustrativos (en Inicio):** tres testimonios escritos por el equipo a partir de las preguntas de la encuesta, para mostrar el tipo de experiencias que recoge el foro. En la página están marcados como ilustrativos.
- **De la comunidad:** lo que publica cualquier persona con una cuenta.

## El foro

- **Cuentas:** solo con seudónimo y contraseña, sin correo ni nombre real. Un botón genera un seudónimo al azar.
- **Publicar:** con título opcional, un tema guía basado en las preguntas del formulario y una imagen opcional, que se reduce antes de subirse.
- **Hilos:** comentarios y respuestas anidadas, como en Reddit.
- **"Me identifico":** una marca por cuenta en cada publicación.
- **Reportar:** con 3 reportes, una publicación o comentario se oculta sola.
- **Borrar:** cada persona puede borrar lo que publicó o comentó.
- **Filtros:** todas, del formulario o de la comunidad, por recientes o por las más apoyadas.

## Tecnologías

| Parte | Herramienta |
| --- | --- |
| Interfaz | React 19, Vite, React Router, Framer Motion, Lucide |
| Base de datos y cuentas | Supabase (PostgreSQL, Auth, Storage y seguridad por filas) |
| Publicación | Vercel |

## Estructura

```
pussy-web/
├── public/img/                 fotos de la página
├── src/
│   ├── pages/                  Inicio, Historias, Hallazgos, Docentes y familias, Misión, Privacidad y cuentas
│   ├── components/
│   │   ├── ui.jsx              piezas comunes (encabezados, fotos, animaciones)
│   │   ├── Ayuda.jsx           recuadro de líneas de ayuda e invitación a la encuesta
│   │   ├── Puntos.jsx          gráfica de puntos (por ejemplo, 6 de 9)
│   │   └── testimonios/        foro: publicaciones, hilos, avatares y estilos
│   ├── data/
│   │   ├── testimonios.js      testimonios del formulario y temas
│   │   ├── hallazgos.js        auditoría de manuales y resultados de la encuesta
│   │   └── ayuda.js            líneas de salud mental y link de la encuesta
│   └── lib/
│       ├── supabase.js         conexión con Supabase
│       ├── sesion.js           crear cuenta, entrar y salir
│       ├── foro.js             publicaciones, comentarios, apoyos y reportes
│       ├── imagen.js           reduce las imágenes antes de subirlas
│       ├── moderacion.js       filtro de insultos y nombres, y aviso de cuidado
│       └── seudonimo.js        generador de seudónimos al azar
├── supabase/foro.sql           tablas, permisos y funciones de la base de datos
├── vercel.json                 rutas para que funcione al recargar cualquier página
└── DESPLIEGUE.md               guía paso a paso para publicar
```

## Cómo correrlo en tu computador

Necesitas Node.js 20.19 o más reciente.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Sin llaves de Supabase la página funciona en **modo de prueba**: todo se guarda solo en ese navegador y un aviso lo indica. Para conectarla a la base de datos, crea un archivo `.env.local` en la carpeta del proyecto con tus datos:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_KEY=sb_publishable_xxxxxxxx
```

Después vuelve a correr `npm run dev`. `.env.local` no se sube a GitHub.

## Base de datos

Todo está en `supabase/foro.sql`. Se pega en el **SQL Editor** de Supabase y se le da **Run**. Se puede volver a correr cuando cambie el archivo, sin borrar lo que ya existe.

| Tabla | Qué guarda |
| --- | --- |
| `publicaciones` | historias del foro y una fila por cada testimonio del formulario |
| `comentarios` | comentarios y respuestas, enlazados por `padre_id` |
| `apoyos` | quién marcó "Me identifico" en qué publicación |
| `reportes` | quién reportó qué, para ocultar lo que tenga 3 reportes |
| `moderadores` | las cuentas del equipo que pueden quitar publicaciones y comentarios |

La seguridad está en la base de datos: cualquiera puede leer, solo las cuentas pueden publicar, comentar, marcar y reportar, y cada cuenta solo puede borrar lo suyo. En Supabase hay que **apagar Confirm email** (Authentication → Sign In / Providers → Email), porque las cuentas no usan correo.

## Despliegue

La página está publicada en Vercel. Los pasos completos están en [`DESPLIEGUE.md`](DESPLIEGUE.md). En resumen:

1. En Vercel, en **Environment Variables**, agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` con el tipo **Config**.
2. Publica desde la terminal:

   ```bash
   npx vercel --prod
   ```

## Moderación

- **Normas del foro** visibles arriba de las historias: se puede criticar sin insultar y sin nombres reales.
- **Filtro de insultos** en la página (`src/lib/moderacion.js`) y en la base de datos (función `texto_permitido` en `supabase/foro.sql`), para que no se pueda saltar.
- **Aviso de cuidado** con las líneas de ayuda cuando un mensaje suena a riesgo. No bloquea, solo avisa.
- **Cuentas del equipo** con la etiqueta Equipo, que pueden quitar lo que no cumpla las normas. Se agregan en la tabla `moderadores`; los pasos están en [`DESPLIEGUE.md`](DESPLIEGUE.md).
- **Desde Supabase:** borrar publicaciones o comentarios en **Table Editor**, borrar cuentas en **Authentication → Users** y revisar la tabla `reportes`.

## Privacidad y cuidado

- No se pide nombre, correo ni ningún dato personal. Supabase necesita un correo por cuenta, así que la página arma uno interno a partir del seudónimo, en un dominio que no existe y que nadie ve.
- Por eso una contraseña olvidada no se puede recuperar. La solución es borrar la cuenta y crear otra.
- El foro, la página de privacidad y la de docentes muestran las líneas gratuitas de salud mental: Línea 106, Línea Amiga Saludable de Medellín ((604) 444 4448), Salud para el alma de Antioquia (604 540 7180) y el 123 para emergencias. Están en `src/data/ayuda.js` y conviene revisarlas de vez en cuando, porque los números pueden cambiar.

## Limitaciones

- Un proyecto gratis de Supabase se pausa si pasa 7 días sin uso. Se reactiva desde el panel con **Resume project**.
- La página publicada no se actualiza sola con cada push, porque se despliega desde la terminal. Para actualizarla hay que volver a correr `npx vercel --prod`.
