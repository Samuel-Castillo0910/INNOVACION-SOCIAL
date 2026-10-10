# LOSS OF OTHERNESS

**Página en línea:** [loss-of-otherness.vercel.app](https://loss-of-otherness.vercel.app)

Plataforma web para el proyecto de innovación social sobre la **pérdida de la otredad en las comunidades escolares**. Es un espacio anónimo donde estudiantes, egresados y profesores cuentan cómo vivieron las normas del colegio, cómo los describían y si de verdad los escuchaban.

> “Trascender la norma sancionatoria para construir comunidades educativas empáticas y humanas.”

Proyecto de Innovación Social, Universidad EIA.

---

## El problema

Al revisar manuales de convivencia de colegios de Medellín y Rionegro encontramos que el lenguaje normativo muchas veces juzga a los estudiantes por **atributos** ("desinteresado", "apático", "conflictivo") en lugar de por **conductas**. Además, el derecho a ser escuchado suele quedar limitado a los momentos de acusación.

Cuando un colegio pasa de describir lo que alguien hizo a decidir quién es, se pierde la mirada sobre la persona: eso es lo que llamamos pérdida de la otredad.

## Qué busca la página

- **Visibilizar** cómo las normas y los manuales afectan la salud mental y la forma en que se trata a los estudiantes.
- **Escuchar** a quienes vivieron el colegio, de forma anónima y segura.
- **Convertir esas voces en retroalimentación** para que las instituciones identifiquen sus brechas de empatía y avancen hacia una convivencia basada en el diálogo y la justicia restaurativa.

## Secciones

| Página | Qué tiene |
| --- | --- |
| **Inicio** | Bienvenida, explicación del espacio y tres testimonios ilustrativos. |
| **Blog** | Los testimonios del formulario y el foro abierto de la comunidad. |
| **Privacidad** | Cómo se protege la identidad y la información de quienes participan. |
| **Nuestra misión** | Misión y visión del proyecto. |
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
│   ├── pages/                  Inicio, Blog, Privacidad, Misión y cuentas
│   ├── components/
│   │   ├── ui.jsx              piezas comunes (encabezados, fotos, animaciones)
│   │   └── testimonios/        foro: publicaciones, hilos, avatares y estilos
│   ├── data/testimonios.js     testimonios del formulario
│   └── lib/
│       ├── supabase.js         conexión con Supabase
│       ├── sesion.js           crear cuenta, entrar y salir
│       ├── foro.js             publicaciones, comentarios, apoyos y reportes
│       ├── imagen.js           reduce las imágenes antes de subirlas
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

Sin llaves de Supabase la página funciona en **modo de prueba**: todo se guarda solo en ese navegador y un aviso lo indica. Para conectarla a la base de datos, copia `.env.example` como `.env.local` y pon tus datos:

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

La seguridad está en la base de datos: cualquiera puede leer, solo las cuentas pueden publicar, comentar, marcar y reportar, y cada cuenta solo puede borrar lo suyo. En Supabase hay que **apagar Confirm email** (Authentication → Sign In / Providers → Email), porque las cuentas no usan correo.

## Despliegue

La página está publicada en Vercel. Los pasos completos están en [`DESPLIEGUE.md`](DESPLIEGUE.md). En resumen:

1. En Vercel, en **Environment Variables**, agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` con el tipo **Config**.
2. Publica desde la terminal:

   ```bash
   npx vercel --prod
   ```

## Moderación

- **Borrar una publicación o un comentario:** en Supabase, **Table Editor**, tablas `publicaciones` o `comentarios`.
- **Borrar una cuenta:** **Authentication → Users**.
- **Revisar reportes:** tabla `reportes`.

## Privacidad y cuidado

- No se pide nombre, correo ni ningún dato personal. Supabase necesita un correo por cuenta, así que la página arma uno interno a partir del seudónimo, en un dominio que no existe y que nadie ve.
- Por eso una contraseña olvidada no se puede recuperar. La solución es borrar la cuenta y crear otra.
- El foro muestra una línea de ayuda en salud mental (Línea 106 en Medellín, 24 horas) para quien la necesite.

## Limitaciones

- Un proyecto gratis de Supabase se pausa si pasa 7 días sin uso. Se reactiva desde el panel con **Resume project**.
- La página publicada no se actualiza sola con cada push, porque se despliega desde la terminal. Para actualizarla hay que volver a correr `npx vercel --prod`.
