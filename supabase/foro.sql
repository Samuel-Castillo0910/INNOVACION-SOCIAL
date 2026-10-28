-- base de datos de loss of otherness, foro de testimonios con cuentas
-- copiar todo este archivo en supabase, sql editor, y darle run
-- se puede volver a correr sin problema, no borra lo que ya publico la gente

-- publicaciones del foro, los testimonios del formulario son filas fijas sin cuenta
create table if not exists publicaciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
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

-- comentarios y respuestas, si padre_id es null es un comentario directo a la publicacion
create table if not exists comentarios (
  id uuid primary key default gen_random_uuid(),
  publicacion_id uuid not null references publicaciones (id) on delete cascade,
  padre_id uuid references comentarios (id) on delete cascade,
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  alias text not null default 'Anónimo',
  texto text not null,
  reportes integer not null default 0,
  created_at timestamptz not null default now()
);

-- por si las tablas ya existian de una version anterior
alter table publicaciones add column if not exists titulo text;
alter table publicaciones add column if not exists imagen_url text;
alter table publicaciones add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;
alter table comentarios add column if not exists user_id uuid default auth.uid() references auth.users (id) on delete cascade;
alter table publicaciones alter column texto set default '';

create index if not exists comentarios_publicacion_idx on comentarios (publicacion_id);

-- me identifico, una marca por cuenta y publicacion
create table if not exists apoyos (
  publicacion_id uuid not null references publicaciones (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (publicacion_id, user_id)
);

-- reportes, uno por cuenta, con 3 la publicacion o el comentario deja de verse
create table if not exists reportes (
  objeto_id uuid not null,
  tipo text not null check (tipo in ('publicacion', 'comentario')),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (objeto_id, user_id)
);

-- la fila de la sintesis general de la primera version ya no se usa
delete from publicaciones where id = '00000000-0000-0000-0000-000000000001';

-- una fila por cada testimonio del formulario, el texto real esta en src/data/testimonios.js
insert into publicaciones (id, user_id, alias, fijada, created_at) values
  ('00000000-0000-0000-0000-000000000101', null, 'Egresado 06', true, '2026-10-05 18:24:05-05'),
  ('00000000-0000-0000-0000-000000000102', null, 'Comuna 8', true, '2026-10-05 19:32:16-05'),
  ('00000000-0000-0000-0000-000000000103', null, 'JuanjitoGiraldo89', true, '2026-10-06 14:12:54-05'),
  ('00000000-0000-0000-0000-000000000104', null, 'CuMaster777', true, '2026-10-06 14:15:05-05'),
  ('00000000-0000-0000-0000-000000000105', null, 'Juanca', true, '2026-10-06 14:25:25-05'),
  ('00000000-0000-0000-0000-000000000106', null, 'Emhdm', true, '2026-10-06 14:58:54-05'),
  ('00000000-0000-0000-0000-000000000107', null, 'La Cabra', true, '2026-10-06 16:05:01-05'),
  ('00000000-0000-0000-0000-000000000108', null, 'Tomás Turbado', true, '2026-10-07 18:54:13-05'),
  ('00000000-0000-0000-0000-000000000109', null, 'Cirilo_y_caiman2026', true, '2026-10-07 19:31:50-05')
on conflict (id) do nothing;

-- los contadores se actualizan solos cuando alguien marca o reporta
create or replace function contar_apoyo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update publicaciones set apoyos = apoyos + 1 where id = new.publicacion_id;
    return new;
  end if;
  update publicaciones set apoyos = greatest(apoyos - 1, 0) where id = old.publicacion_id;
  return old;
end;
$$;

drop trigger if exists contar_apoyo on apoyos;
create trigger contar_apoyo after insert or delete on apoyos
  for each row execute function contar_apoyo();

create or replace function contar_reporte()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.tipo = 'publicacion' then
    update publicaciones set reportes = reportes + 1 where id = new.objeto_id and fijada = false;
  else
    update comentarios set reportes = reportes + 1 where id = new.objeto_id;
  end if;
  return new;
end;
$$;

drop trigger if exists contar_reporte on reportes;
create trigger contar_reporte after insert on reportes
  for each row execute function contar_reporte();

-- moderacion, los mensajes con insultos no se guardan, la pagina revisa lo mismo antes de enviar
-- el texto se pasa a minuscula, sin tildes, con numeros cambiados por letras y sin letras repetidas tres o mas veces
-- se puede criticar una norma o un colegio, lo que no pasa son los insultos
create or replace function texto_permitido(t text)
returns boolean
language sql
immutable
as $$
  with limpio as (
    select regexp_replace(
      translate(lower(coalesce(t, '')), 'áéíóúüñàèìòùÁÉÍÓÚÜÑ0134@$', 'aeiouunaeiouaeiouunoieaas'),
      '(.)\1\1+', '\1', 'g'
    ) as x
  )
  select not (
    x ~ '\m(hijueputas?|hijos? de (su )?puta|h\W?p|jueputa|gonorreas?|malparid[oa]s?|carechimbas?|pirob[oa]s?|(guevon|huevon|webon|huebon|guebon)(a|es|as)?|idiotas?|imbecil(es)?|estupid[oa]s?|pendej[oa]s?|perras?|zorras?|putas?|maricas?|maricon(es)?|mongolic[oa]s?|subnormal(es)?|malnacid[oa]s?)\M'
    or x ~ '\m(colegio|profes?|profesor(a|es|as)?|rector(a|es|as)?|coordinador(a|es|as)?|directiv[oa]s?|institucion(es)?|monjas?|curas?)\s+(de\s+|(es|era|son|eran)\s+(una?\s+)?)mierda\M'
  )
  from limpio
$$;

-- moderadores, cuentas del equipo que pueden quitar lo que no cumpla las normas
create table if not exists moderadores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function es_moderador()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from moderadores where user_id = auth.uid());
$$;

-- las funciones de la version anterior ya no se usan
drop function if exists apoyar_publicacion(uuid, integer);
drop function if exists reportar_publicacion(uuid);
drop function if exists reportar_comentario(uuid);

-- permisos, cualquiera puede leer, solo las cuentas publican, comentan, marcan y reportan
grant usage on schema public to anon, authenticated;
revoke insert, update, delete on publicaciones, comentarios from anon;
grant select on publicaciones, comentarios to anon, authenticated;
grant insert, delete on publicaciones, comentarios to authenticated;
grant select, insert, delete on apoyos to authenticated;
grant select, insert on reportes to authenticated;
grant select on moderadores to anon, authenticated;
grant execute on function texto_permitido(text) to anon, authenticated;
grant execute on function es_moderador() to anon, authenticated;

alter table publicaciones enable row level security;
alter table comentarios enable row level security;
alter table apoyos enable row level security;
alter table reportes enable row level security;
alter table moderadores enable row level security;

drop policy if exists "leer publicaciones" on publicaciones;
create policy "leer publicaciones" on publicaciones
  for select to anon, authenticated using (true);

drop policy if exists "crear publicaciones" on publicaciones;
create policy "crear publicaciones" on publicaciones
  for insert to authenticated with check (
    user_id = auth.uid()
    and fijada = false and apoyos = 0 and reportes = 0
    and char_length(trim(texto)) between 1 and 20000
    and char_length(alias) between 1 and 40
    and (titulo is null or char_length(titulo) <= 120)
    and (tema is null or char_length(tema) <= 60)
    and (imagen_url is null or imagen_url like '%/storage/v1/object/public/imagenes/%')
    and texto_permitido(texto) and texto_permitido(titulo)
  );

drop policy if exists "borrar mis publicaciones" on publicaciones;
create policy "borrar mis publicaciones" on publicaciones
  for delete to authenticated using (user_id = auth.uid());

-- los moderadores pueden quitar publicaciones de la comunidad, nunca los testimonios del formulario
drop policy if exists "moderar publicaciones" on publicaciones;
create policy "moderar publicaciones" on publicaciones
  for delete to authenticated using (fijada = false and es_moderador());

drop policy if exists "leer comentarios" on comentarios;
create policy "leer comentarios" on comentarios
  for select to anon, authenticated using (true);

drop policy if exists "crear comentarios" on comentarios;
create policy "crear comentarios" on comentarios
  for insert to authenticated with check (
    user_id = auth.uid()
    and reportes = 0
    and char_length(trim(texto)) between 1 and 2000
    and char_length(alias) between 1 and 40
    and texto_permitido(texto)
  );

drop policy if exists "borrar mis comentarios" on comentarios;
create policy "borrar mis comentarios" on comentarios
  for delete to authenticated using (user_id = auth.uid());

drop policy if exists "moderar comentarios" on comentarios;
create policy "moderar comentarios" on comentarios
  for delete to authenticated using (es_moderador());

-- cualquiera puede ver quien es moderador, asi la pagina pone la etiqueta de equipo
drop policy if exists "ver moderadores" on moderadores;
create policy "ver moderadores" on moderadores
  for select to anon, authenticated using (true);

drop policy if exists "ver mis apoyos" on apoyos;
create policy "ver mis apoyos" on apoyos
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "marcar apoyo" on apoyos;
create policy "marcar apoyo" on apoyos
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "quitar apoyo" on apoyos;
create policy "quitar apoyo" on apoyos
  for delete to authenticated using (user_id = auth.uid());

drop policy if exists "ver mis reportes" on reportes;
create policy "ver mis reportes" on reportes
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "reportar" on reportes;
create policy "reportar" on reportes
  for insert to authenticated with check (user_id = auth.uid());

-- imagenes opcionales, carpeta publica de maximo 3 MB por imagen
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes', 'imagenes', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- cada cuenta sube imagenes solo a su propia carpeta y no puede cambiarlas ni borrarlas
drop policy if exists "subir imagenes del foro" on storage.objects;
create policy "subir imagenes del foro" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'imagenes' and (storage.foldername(name))[1] = auth.uid()::text);

-- para volver moderadora una cuenta del equipo, primero se crea en la pagina, luego se cambia el seudonimo aqui
-- y se corre solo este bloque, quitandole los dos guiones del inicio a cada linea
-- insert into moderadores (user_id)
-- select id from auth.users where raw_user_meta_data ->> 'seudonimo' = 'Equipo LOSS OF OTHERNESS'
-- on conflict do nothing;
