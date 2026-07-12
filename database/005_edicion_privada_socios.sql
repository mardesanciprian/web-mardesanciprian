-- ============================================================
-- MAR DE SAN CIPRIÁN
-- 005_edicion_privada_socios.sql
--
-- Permite editar fichas de socios únicamente a usuarios
-- autenticados del Centro de Gestión.
-- ============================================================

grant update on table public.socios to authenticated;

drop policy if exists "Edición privada de socios"
on public.socios;

create policy "Edición privada de socios"
on public.socios
for update
to authenticated
using (
  auth.uid() is not null
)
with check (
  auth.uid() is not null
  and acepta_privacidad = true
  and char_length(trim(nombre)) between 2 and 100
  and char_length(trim(apellidos)) between 2 and 150
  and char_length(trim(email)) between 5 and 254
  and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and char_length(trim(localidad)) between 2 and 100
  and char_length(trim(provincia)) between 2 and 100
);