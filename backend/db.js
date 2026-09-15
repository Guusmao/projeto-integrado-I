const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'deposito.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao abrir banco de dados:', err);
  } else {
    console.log('Banco de dados SQLite conectado');
    inicializarBanco();
  }
});

function inicializarBanco() {
  // Cria tabela de produtos se não existir
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco_compra REAL NOT NULL,
      preco_venda REAL NOT NULL,
      desconto REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela produtos:', err);
    } else {
      console.log('Tabela produtos pronta');
      // Verifica se banco está vazio e insere dados iniciais
      db.get('SELECT COUNT(*) as count FROM produtos', (err, row) => {
        if (row.count === 0) {
          inserirDadosIniciais();
        }
      });
    }
  });

  // Cria tabela de usuários para login
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela usuarios:', err);
    } else {
      console.log('Tabela usuarios pronta');
      // Verifica se existe usuário admin
      db.get('SELECT COUNT(*) as count FROM usuarios', (err, row) => {
        if (row.count === 0) {
          db.run(
            'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)',
            ['admin', 'admin'],
            (err) => {
              if (!err) {
                console.log('Usuário admin/admin criado');
              }
            }
          );
        }
      });
    }
  });
}

function inserirDadosIniciais() {
  const produtos = [
    { nome: 'Cimento CP-32 (saco 50kg)', preco_compra: 25.00, preco_venda: 35.00, desconto: 5 },
    { nome: 'Tinta Acrílica 18L', preco_compra: 45.00, preco_venda: 75.00, desconto: 10 },
    { nome: 'Parafuso Phillips 3/16', preco_compra: 0.50, preco_venda: 1.50, desconto: 0 },
    { nome: 'Areia Lavada (m³)', preco_compra: 30.00, preco_venda: 50.00, desconto: 5 },
    { nome: 'Tijolo Cerâmico 8 furos', preco_compra: 0.80, preco_venda: 1.50, desconto: 0 },
    { nome: 'Cal Hidratada (saco 20kg)', preco_compra: 8.00, preco_venda: 15.00, desconto: 5 },
    { nome: 'Cano PVC 100mm (metro)', preco_compra: 12.00, preco_venda: 20.00, desconto: 10 },
    { nome: 'Telha de Barro', preco_compra: 1.50, preco_venda: 3.00, desconto: 0 }
  ];

  const stmt = db.prepare(
    'INSERT INTO produtos (nome, preco_compra, preco_venda, desconto) VALUES (?, ?, ?, ?)'
  );

  produtos.forEach((p) => {
    stmt.run([p.nome, p.preco_compra, p.preco_venda, p.desconto]);
  });

  stmt.finalize();
  console.log('8 produtos iniciais inseridos');
}

module.exports = db;
