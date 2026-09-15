# 📦 Sistema de Consulta de Preços - Depósito Piauí

Protótipo funcional de um sistema web rápido e simples para consulta de preços, desenvolvido como **Projeto Integrado** do curso de Análise e Desenvolvimento de Sistemas.

---

## 🎯 O que o sistema faz

✅ **Login seguro** (username: admin, senha: admin)  
✅ **Consulta rápida de preços** - A tela mais importante! Filtro em tempo real  
✅ **Listagem de produtos** com preços de compra, venda e descontos  
✅ **Cadastro de produtos** com cálculo automático de preço com desconto  
✅ **Edição e exclusão** de produtos  
✅ **8 produtos iniciais** já cadastrados como exemplo  

---

## 🛠️ Tecnologias Usadas

**Backend:**
- Node.js + Express (servidor web)
- SQLite (banco de dados simples, sem precisar configurar servidor)

**Frontend:**
- React (interface interativa)
- Tailwind CSS (estilização rápida e limpa)
- Vite (ferramenta de build rápida)

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 14+)
- **npm** (gerenciador de pacotes, vem com Node.js)

Para verificar se tem Node.js instalado, abra o terminal (PowerShell no Windows) e digite:
```bash
node -v
npm -v
```

Se aparecer números de versão, você está pronto! Se não, [baixe Node.js aqui](https://nodejs.org/).

---

## 🚀 Como Rodar o Projeto

### 1️⃣ Abra o terminal na pasta do projeto

```bash
cd c:\Users\Felip\OneDrive\Área de Trabalho\projetos\projeto-integrado-I
```

### 2️⃣ Instale as dependências do backend

```bash
cd backend
npm install
```

Isso vai criar uma pasta `node_modules` com todas as bibliotecas necessárias. Demora um pouco na primeira vez.

### 3️⃣ Inicie o servidor backend

Ainda dentro da pasta `backend`, execute:

```bash
npm start
```

Você deve ver aparecer:
```
✅ Servidor rodando em http://localhost:5000
```

**Deixe esse terminal aberto!** O backend precisa estar rodando para o frontend funcionar.

---

### 4️⃣ Em outro terminal, instale as dependências do frontend

Abra um **novo terminal** PowerShell na pasta raiz do projeto:

```bash
cd c:\Users\Felip\OneDrive\Área de Trabalho\projetos\projeto-integrado-I
cd frontend
npm install
```

### 5️⃣ Inicie o frontend

Ainda dentro da pasta `frontend`:

```bash
npm run dev
```

Você deve ver algo como:
```
VITE v4.3.9  ready in 123 ms
➜  Local:   http://localhost:3000/
➜  press h to show help
```

Seu navegador deve abrir automaticamente em `http://localhost:3000`. Se não abrir, clique nesse link!

---

## 🔐 Dados de Acesso

**Usuário:** `admin`  
**Senha:** `admin`

(Isso é proposital! Em um sistema real, usaríamos hash seguro de senhas. Mas como é um protótipo de apresentação, deixamos assim pra facilitar.)

---

## 📱 Como Usar o Sistema

### 🔍 Tela de Consulta (a mais importante!)

1. Faça login com admin/admin
2. Na tela "Consultar Preço", digite o nome de um produto na busca
3. Clique no produto pra ver o preço de venda e o preço com desconto em destaque
4. Perfeito pra quando um cliente quer saber o preço rapidinho!

### 📋 Tela de Produtos

- Vê todos os produtos cadastrados em uma tabela
- Pode editar qualquer produto clicando em "✏️ Editar"
- Pode excluir produtos clicando em "🗑️ Excluir"

### ➕ Tela de Novo Produto

- Preenche nome, preço de compra, preço de venda e desconto (opcional)
- O sistema calcula automaticamente o preço final com desconto
- Mostra preview da margem de lucro

---

## 📊 Estrutura do Projeto

```
projeto-integrado-I/
│
├── backend/
│   ├── package.json          (dependências do backend)
│   ├── server.js             (servidor Express com as rotas)
│   ├── db.js                 (configuração SQLite + dados iniciais)
│   ├── node_modules/         (bibliotecas instaladas)
│   └── deposito.db           (banco de dados SQLite)
│
├── frontend/
│   ├── package.json          (dependências do frontend)
│   ├── vite.config.js        (configuração do Vite)
│   ├── index.html            (página HTML principal)
│   ├── src/
│   │   ├── main.jsx          (entry point do React)
│   │   ├── App.jsx           (componente principal)
│   │   └── pages/
│   │       ├── Login.jsx     (tela de login)
│   │       ├── ConsultaPreco.jsx  (tela de busca rápida)
│   │       ├── Dashboard.jsx      (listagem de produtos)
│   │       └── CadastroProduto.jsx (cadastro de novos produtos)
│   ├── node_modules/         (bibliotecas instaladas)
│   └── dist/                 (build compilado, criado ao fazer build)
│
└── README.md                 (este arquivo!)
```

---

## 🐛 Troubleshooting

### Erro: "Não consegue conectar com o servidor"
- Verifique se o backend está rodando (terminal com `npm start`)
- Verifique se está na porta 5000 (não mude sem avisar pro frontend)

### Erro: "npm: comando não encontrado"
- Node.js não está instalado ou não está no PATH
- Tente reiniciar o computador após instalar Node.js

### Banco de dados vazio
- Se o banco `deposito.db` sumir, não se preocupa!
- Na próxima vez que rodar `npm start` no backend, ele recria com os 8 produtos

### Quero resetar os dados
- Apague o arquivo `backend/deposito.db`
- Na próxima rodada, será recriado com os dados iniciais

---

## 📝 Notas Importantes

✅ **Simplicidade em primeiro lugar**: O código é fácil de ler e entender, sem complexidades desnecessárias.

✅ **Sem autenticação pesada**: Usamos um simples username/password em SQLite. Em produção, seria diferente!

✅ **Sem HTTPS**: Rodando local, usamos HTTP simples. Em produção, seria HTTPS obrigatório.

✅ **SQLite local**: Perfeito pra protótipo! Em produção, seria um banco maior como PostgreSQL.

---

## 🎓 Para Apresentação do Projeto

Pontos a destacar pro Prof. Veras:

1. **Entendimento do problema**: Você identificou que o cliente quer VELOCIDADE, não funcionalidades complexas
2. **Separação backend/frontend**: Arquitetura clara e profissional
3. **Autenticação**: Mesmo simples, mostra preocupação com segurança
4. **Cálculos automáticos**: Preço com desconto e margem de lucro são calculados dinamicamente
5. **Interface amigável**: Tailwind deixa tudo bonito e responsivo
6. **Dados de teste**: 8 produtos prontos pra demonstrar funcionando

---

## 📧 Contato / Dúvidas

Se tiver problemas ao rodar, verifique:
1. Node.js instalado? (`node -v`)
2. Dependências instaladas? (rode `npm install` nos dois diretórios)
3. Backend rodando? (terminal com `npm start` no backend)
4. Frontend rodando? (terminal com `npm run dev` no frontend)

---

**Desenvolvido como protótipo funcional para Projeto Integrado - ADS**  
🚀 Boa apresentação!
