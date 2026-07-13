-- ============================================================
-- MAR DE SAN CIPRIÁN
-- 002_permitir_altas_socios.sql
--
-- Permite nuevas inscripciones desde la web pública.
-- La lectura, modificación y eliminación siguen bloqueadas.
-- ============================================================

-- Permiso exclusivamente para insertar.
grant insert on table public.socios to anon;

-- Permisos mínimos para las secuencias automáticas.
grant usage on sequence public.socios_id_seq to anon;
grant usage on sequence public.socios_numero_seq to anon;

-- Permite ejecutar nuevamente este archivo sin duplicar la política.
drop policy if exists "Permitir inscripción pública de socios"
on public.socios;

create policy "Permitir inscripción pública de socios"
on public.socios
for insert
to anon
with check (
  acepta_privacidad = true
  and char_length(trim(nombre)) between 2 and 100
  and char_length(trim(apellidos)) between 2 and 150
  and char_length(trim(email)) between 5 and 254
  and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  and char_length(trim(localidad)) between 2 and 100
  and char_length(trim(provincia)) between 2 and 100
);