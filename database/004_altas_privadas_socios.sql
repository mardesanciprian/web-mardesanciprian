-- ============================================================
-- MAR DE SAN CIPRIÁN
-- 004_altas_privadas_socios.sql
--
-- Permite que las personas autenticadas del Centro de Gestión
-- puedan registrar socios presencialmente.
-- ============================================================

grant insert on table public.socios to authenticated;

grant usage on sequence public.socios_id_seq to authenticated;
grant usage on sequence public.socios_numero_seq to authenticated;

drop policy if exists "Alta privada de socios"
on public.socios;

create policy "Alta privada de socios"
on public.socios
for insert
to authenticated
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