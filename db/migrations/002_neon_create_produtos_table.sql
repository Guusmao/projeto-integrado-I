-- Migração do banco para o Neon (Postgres).
-- Mesmo schema da 001 (Supabase), sem os dados de exemplo:
-- os produtos são copiados do Supabase separadamente.
create table if not exists produtos (
  id bigint primary key generated always as identity,
  nome text not null,
  preco_compra numeric not null,
  preco_venda numeric not null,
  desconto numeric default 0,
  created_at timestamp with time zone default now()
);
