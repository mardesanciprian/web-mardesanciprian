-- ============================================================
-- MAR DE SAN CIPRIÁN
-- 003_consulta_privada_socios.sql
--
-- Permite consultar los socios únicamente a usuarios
-- autenticados del Centro de Gestión.
--
-- La web pública continúa sin poder leer, editar ni eliminar
-- datos personales.
-- ============================================================

-- Permiso de lectura para usuarios que hayan iniciado sesión.
grant select on table public.socios to authenticated;

-- Puede ejecutarse nuevamente sin duplicar la política.
drop policy if exists "Consulta privada de socios"
on public.socios;

create policy "Consulta privada de socios"
on public.socios
for select
to authenticated
using (
  auth.uid() is not null
);