# Cómo poner la página en línea

La página usa **Supabase** como base de datos (cuentas, publicaciones, comentarios e imágenes) y **Vercel** para publicarla. Los dos son gratis.

## 1. Supabase (base de datos y cuentas)

1. Entra a [supabase.com](https://supabase.com), crea una cuenta y dale a **New project**. Ponle un nombre, una contraseña de base de datos (guárdala) y la región más cercana.
2. En el menú de la izquierda abre **SQL Editor**, pega todo el archivo `supabase/foro.sql` y dale **Run**. Debe decir *Success*. Se puede volver a correr cuando se actualice el archivo.
3. Abre **Authentication → Sign In / Providers → Email**, apaga **Confirm email** y guarda. Es obligatorio: la página no pide correo (las cuentas son solo seudónimo y contraseña), así que nadie podría confirmar nada y no se podría crear ninguna cuenta.
4. Dale al botón **Connect** (arriba) o ve a **Project Settings → API Keys**. Copia la **Project URL** y la **publishable key**.

## 2. Probar en tu computador

1. Copia `.env.example` con el nombre `.env.local` y pega ahí la URL y la llave.
2. Corre `npm run dev` y abre `http://localhost:5173/blog`.
3. Si el aviso de "Modo de prueba" ya no sale, está conectado. Crea una cuenta con un seudónimo y publica algo para probar.

`.env.local` no se sube a GitHub, eso está bien.

## 3. Vercel (publicar la página)

Vercel se conecta con la cuenta de GitHub dueña del repo. Si el repo no es tuyo, lo más fácil es que el dueño haga este paso.

1. Entra a [vercel.com](https://vercel.com) con GitHub y dale a **Add New → Project**.
2. Importa el repo `pussy-web`. Vercel reconoce Vite solo, no cambies nada de la compilación.
3. Abre **Environment Variables** y agrega las dos mismas de `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
4. Dale **Deploy**. Al final te da el enlace, algo como `pussy-web.vercel.app`.
5. En Supabase, en **Authentication → URL Configuration**, pon ese enlace como **Site URL**.

Cada vez que se sube algo a la rama principal en GitHub, Vercel actualiza la página solo. Si cambias las variables de entorno, tienes que ir a **Deployments** y darle **Redeploy**.

## 4. Cómo funcionan las cuentas

- Para registrarse solo se pide un seudónimo y una contraseña. El botón del dado genera un seudónimo al azar.
- Supabase necesita un correo para cada cuenta, así que la página arma uno interno con el seudónimo que termina en `.invalid`, un dominio que no existe. A esa dirección nunca llega nada y nadie la ve.
- Por lo mismo, si alguien olvida su contraseña no se puede recuperar. Si hace falta, se borra la cuenta en **Authentication → Users** y la persona crea otra.

## 5. Moderar

La moderación tiene cuatro partes:

- **Normas del foro:** se ven arriba de las historias. Se puede criticar una norma, a un profesor o a un colegio, pero sin insultar ni escribir nombres reales.
- **Filtro de insultos:** la página no deja publicar ni comentar mensajes con insultos ni nombres de colegios o personas. La base de datos revisa los mismos insultos con la función `texto_permitido` de `supabase/foro.sql`, así que tampoco se puede saltar desde fuera de la página. La lista de palabras está en ese archivo y en `src/lib/moderacion.js`; si cambian una, cambien la otra.
- **Aviso de cuidado:** si alguien escribe algo que suena a riesgo (por ejemplo "quiero desaparecer"), antes de publicar le aparecen las líneas de ayuda. No se bloquea, solo se avisa.
- **Cuentas del equipo:** pueden quitar publicaciones y comentarios de cualquier persona, y llevan la etiqueta **Equipo**. No pueden quitar los testimonios del formulario.

Para volver moderadora una cuenta:

1. Creen la cuenta en la página, por ejemplo con el seudónimo `Equipo LOSS OF OTHERNESS`.
2. En Supabase, **SQL Editor**, corran esto con el seudónimo exacto:

   ```sql
   insert into moderadores (user_id)
   select id from auth.users where raw_user_meta_data ->> 'seudonimo' = 'Equipo LOSS OF OTHERNESS'
   on conflict do nothing;
   ```

3. Recarguen la página. Ya debe aparecer la etiqueta y el botón **Quitar**.

Para quitarle el permiso: `delete from moderadores;` borra a todos, o borren la fila en **Table Editor → moderadores**.

También se puede moderar desde Supabase:

- Borrar una publicación o comentario: **Table Editor** → `publicaciones` o `comentarios` → borrar la fila.
- Borrar una cuenta: **Authentication → Users**.
- Las publicaciones con 3 reportes se ocultan solas. Se pueden revisar en la tabla `reportes`.

Un proyecto gratis de Supabase se pausa si pasa 7 días sin uso. Se reactiva desde el panel con **Resume project**. Abran la página uno o dos días antes de presentar.
