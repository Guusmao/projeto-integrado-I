create table if not exists produtos (
  id bigint primary key generated always as identity,
  nome text not null,
  preco_compra numeric not null,
  preco_venda numeric not null,
  desconto numeric default 0,
  created_at timestamp with time zone default now()
);

insert into produtos (nome, preco_compra, preco_venda, desconto) values
  ('Cimento CP-32 (saco 50kg)', 25.00, 35.00, 5),
  ('Tinta Acrílica 18L', 45.00, 75.00, 10),
  ('Parafuso Phillips 3/16', 0.50, 1.50, 0),
  ('Areia Lavada (m³)', 30.00, 50.00, 5),
  ('Tijolo Cerâmico 8 furos', 0.80, 1.50, 0),
  ('Cal Hidratada (saco 20kg)', 8.00, 15.00, 5),
  ('Cano PVC 100mm (metro)', 12.00, 20.00, 10),
  ('Telha de Barro', 1.50, 3.00, 0);
