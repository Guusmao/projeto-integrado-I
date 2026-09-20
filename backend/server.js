const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('../api/index.js');

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
