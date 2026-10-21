-- MAR DE SAN CIPRIÁN
-- Tabla de administradores autorizados

create table if not exists public.administradores (
  usuario_id uuid primary key
    references auth.users(id) on delete cascade,

  created_at timestamptz not null default now()
);

-- Activar seguridad por filas
alter table public.administradores
enable row level security;

-- Permitir que cada usuario autenticado
-- consulte únicamente su propia autorización
grant select on public.administradores
to authenticated;

create policy "Consultar autorización propia"
on public.administradores
for select
to authenticated
using (
  usuario_id = (select auth.uid())
);