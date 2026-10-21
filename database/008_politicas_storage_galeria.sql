-- ============================================================
-- MAR DE SAN CIPRIÁN
-- 008_politicas_storage_galeria.sql
--
-- Políticas de Supabase Storage para el bucket "galeria".
--
-- El bucket es público para lectura.
-- Las operaciones de subida, modificación y borrado
-- quedan restringidas a usuarios autenticados.
-- ============================================================


-- ============================================================
-- SUBIDA DE ARCHIVOS
-- ============================================================

drop policy if exists "Subida privada a galeria"
on storage.objects;

create policy "Subida privada a galeria"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'galeria'
  and auth.uid() is not null
);


-- ============================================================
-- CONSULTA PRIVADA DE OBJETOS
-- ============================================================

drop policy if exists "Consulta privada de galeria"
on storage.objects;

create policy "Consulta privada de galeria"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'galeria'
  and auth.uid() is not null
);


-- ============================================================
-- ACTUALIZACIÓN DE ARCHIVOS
-- ============================================================

drop policy if exists "Edicion privada de galeria"
on storage.objects;

create policy "Edicion privada de galeria"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'galeria'
  and auth.uid() is not null
)
with check (
  bucket_id = 'galeria'
  and auth.uid() is not null
);


-- ============================================================
-- ELIMINACIÓN DE ARCHIVOS
-- ============================================================

drop policy if exists "Eliminacion privada de galeria"
on storage.objects;

create policy "Eliminacion privada de galeria"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'galeria'
  and auth.uid() is not null
);