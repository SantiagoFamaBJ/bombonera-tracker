-- Correr UNA vez en Supabase → SQL Editor, ANTES de usar la sección TORNEOS
alter table partidos add column if not exists competicion text;
