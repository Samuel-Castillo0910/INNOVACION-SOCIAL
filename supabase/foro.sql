-- foro de testimonios de loss of otherness
-- copiar todo este archivo en supabase, sql editor, y darle run
-- se puede volver a correr sin problema, no borra lo que ya publico la gente

-- publicaciones del foro, los testimonios del formulario son filas fijas
create table if not exists publicaciones (
  id uuid primary key default gen_random_uuid(),
  alias text not null default 'Anónimo',
  titulo text,
  texto text not null default '',
  tema text,
  imagen_url text,
  fijada boolean not null default false,
  apoyos integer not null default 0,
  reportes integer not null default 0,
  created_at timestamptz not null default now()
);

-- por si la tabla ya existia de una version anterior
alter table publicaciones add column if not exists titulo text;
alter table publicaciones add column if not exists imagen_url text;
alter table publicaciones alter column texto set default '';

-- comentarios y respuestas, si padre_id es null es un comentario directo a la publicacion
create table if not exists comentarios (
  id uuid primary key default gen_random_uuid(),
  publicacion_id uuid not null references publicaciones(id) on delete cascade,
  padre_id uuid references comentarios(id) on delete cascade,
  alias text not null default 'Anónimo',
  texto text not null,
  reportes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists comentarios_publicacion_idx on comentarios (publicacion_id);

-- la fila de la sintesis general de la version anterior ya no se usa
delete from publicaciones where id = '00000000-0000-0000-0000-000000000001';

-- una fila por cada testimonio del formulario, el texto real esta en src/data/testimonios.js
insert into publicaciones (id, alias, fijada, created_at) values
  ('00000000-0000-0000-0000-000000000101', 'Egresado 06', true, '2026-10-05 18:24:05-05'),
  ('00000000-0000-0000-0000-000000000102', 'Comuna 8', true, '2026-10-05 19:32:16-05'),
  ('00000000-0000-0000-0000-000000000103', 'JuanjitoGiraldo89', true, '2026-10-06 14:12:54-05'),
  ('00000000-0000-0000-0000-000000000104', 'CuMaster777', true, '2026-10-06 14:15:05-05'),
  ('00000000-0000-0000-0000-000000000105', 'Juanca', true, '2026-10-06 14:25:25-05'),
  ('00000000-0000-0000-0000-000000000106', 'Emhdm', true, '2026-10-06 14:58:54-05'),
  ('00000000-0000-0000-0000-000000000107', 'La Cabra', true, '2026-10-06 16:05:01-05'),
  ('00000000-0000-0000-0000-000000000108', 'Tomás Turbado', true, '2026-10-07 18:54:13-05'),
  ('00000000-0000-0000-0000-000000000109', 'Cirilo_y_caiman2026', true, '2026-10-07 19:31:50-05')
on conflict (id) do nothing;

-- permisos, cualquiera puede leer y publicar, nadie puede editar ni borrar desde la pagina
grant usage on schema public to anon, authenticated;
grant select, insert on publicaciones, comentarios to anon, authenticated;

alter table publicaciones enable row level security;
alter table comentarios enable row level security;

drop policy if exists "leer publicaciones" on publicaciones;
create policy "leer publicaciones" on publicaciones
  for select to anon, authenticated using (true);

drop policy if exists "crear publicaciones" on publicaciones;
create policy "crear publicaciones" on publicaciones
  for insert to anon, authenticated with check (
    fijada = false and apoyos = 0 and reportes = 0
    and char_length(trim(texto)) between 1 and 4000
    and char_length(alias) between 1 and 40
    and (titulo is null or char_length(titulo) <= 120)
    and (tema is null or char_length(tema) <= 60)
    and (imagen_url is null or imagen_url like '%/storage/v1/object/public/imagenes/%')
  );

drop policy if exists "leer comentarios" on comentarios;
create policy "leer comentarios" on comentarios
  for select to anon, authenticated using (true);

drop policy if exists "crear comentarios" on comentarios;
create policy "crear comentarios" on comentarios
  for insert to anon, authenticated with check (
    reportes = 0
    and char_length(trim(texto)) between 1 and 2000
    and char_length(alias) between 1 and 40
  );

-- me identifico, suma o resta 1 y nunca baja de 0
create or replace function apoyar_publicacion(p_id uuid, p_cambio integer)
returns integer
language sql
security definer
set search_path = public
as $$
  update publicaciones
     set apoyos = greatest(apoyos + case when p_cambio < 0 then -1 else 1 end, 0)
   where id = p_id
  returning apoyos;
$$;

-- reportar, con 3 reportes deja de verse en la pagina, los testimonios del formulario no se pueden reportar
create or replace function reportar_publicacion(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update publicaciones set reportes = reportes + 1 where id = p_id and fijada = false;
$$;

create or replace function reportar_comentario(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update comentarios set reportes = reportes + 1 where id = p_id;
$$;

grant execute on function apoyar_publicacion(uuid, integer) to anon, authenticated;
grant execute on function reportar_publicacion(uuid) to anon, authenticated;
grant execute on function reportar_comentario(uuid) to anon, authenticated;

-- imagenes opcionales, carpeta publica de maximo 3 MB por imagen
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes', 'imagenes', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- cualquiera puede subir imagenes a esa carpeta, pero no cambiarlas ni borrarlas
drop policy if exists "subir imagenes del foro" on storage.objects;
create policy "subir imagenes del foro" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'imagenes');
