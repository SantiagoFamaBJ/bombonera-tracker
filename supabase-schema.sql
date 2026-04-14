-- Tabla de partidos
create table partidos (
  id uuid default gen_random_uuid() primary key,
  fecha date not null,
  rival text not null,
  resultado text not null, -- ej: "2-0"
  fui boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table partidos enable row level security;

-- Política: acceso público total (app personal sin auth)
create policy "Public access" on partidos for all using (true);

-- Índice por fecha
create index idx_partidos_fecha on partidos(fecha);
