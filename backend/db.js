const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function getProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data;
}

async function getProduto(id) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

async function criarProduto(nome, preco_compra, preco_venda, desconto = 0) {
  const { data, error } = await supabase
    .from('produtos')
    .insert([{ nome, preco_compra, preco_venda, desconto }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function atualizarProduto(id, nome, preco_compra, preco_venda, desconto = 0) {
  const { data, error } = await supabase
    .from('produtos')
    .update({ nome, preco_compra, preco_venda, desconto })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deletarProduto(id) {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

module.exports = {
  getProdutos,
  getProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto
};
