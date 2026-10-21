
-- MAR DE SAN CIPRIÁN
-- 010_create_actividades.sql
-- Gestión bilingüe de actividades

create table if not exists public.actividades (
  id uuid primary key default gen_random_uuid(),

  titulo_gl text not null,
  titulo_es text not null,

  descripcion_gl text,
  descripcion_es text,

  fecha_inicio timestamptz,
  fecha_fin timestamptz,

  lugar text,
  categoria text,

  imagen_url text,

  estado text not null default 'borrador'
    check (estado in ('borrador', 'publicada')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint actividades_fechas_validas
    check (
      fecha_fin is null
      or fecha_inicio is null
      or fecha_fin >= fecha_inicio
    )
);

-- Índices para ordenar y filtrar actividades

create index if not exists idx_actividades_fecha
on public.actividades (fecha_inicio);

create index if not exists idx_actividades_estado
on public.actividades (estado);

-- Activar seguridad por filas

alter table public.actividades
enable row level security;

-- Permisos generales de acceso a la tabla

grant select on public.actividades
to anon, authenticated;

grant insert, update, delete on public.actividades
to authenticated;

-- El público puede leer actividades publicadas.
-- Los administradores también pueden leer borradores.

create policy "Leer actividades publicadas o propias de administracion"
on public.actividades
for select
to anon, authenticated
using (
  estado = 'publicada'
  or exists (
    select 1
    from public.administradores a
    where a.usuario_id = (select auth.uid())
  )
);

-- Solo los administradores pueden crear actividades

create policy "Administradores crean actividades"
on public.actividades
for insert
to authenticated
with check (
  exists (
    select 1
    from public.administradores a
    where a.usuario_id = (select auth.uid())
  )
);

-- Solo los administradores pueden modificar actividades

create policy "Administradores modifican actividades"
on public.actividades
for update
to authenticated
using (
  exists (
    select 1
    from public.administradores a
    where a.usuario_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.administradores a
    where a.usuario_id = (select auth.uid())
  )
);

-- Solo los administradores pueden eliminar actividades

create policy "Administradores eliminan actividades"
on public.actividades
for delete
to authenticated
using (
  exists (
    select 1
    from public.administradores a
    where a.usuario_id = (select auth.uid())
  )
);
