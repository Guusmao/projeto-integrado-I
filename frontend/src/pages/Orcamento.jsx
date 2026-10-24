import { useState, useEffect } from 'react'
import API_URL from '../config'

const CHAVE_RASCUNHO = 'orcamento-rascunho'

const formatarMoeda = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const calcularPrecoComDesconto = (preco, desconto) => {
  return preco - (preco * ((desconto || 0) / 100))
}

const carregarRascunho = () => {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_RASCUNHO))
    if (salvo && Array.isArray(salvo.itens)) return salvo
  } catch (err) {
    console.error('Rascunho de orçamento inválido:', err)
  }
  return { cliente: '', observacoes: '', itens: [] }
}

export default function Orcamento() {
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [cliente, setCliente] = useState(() => carregarRascunho().cliente)
  const [observacoes, setObservacoes] = useState(() => carregarRascunho().observacoes)
  // Cada item guarda uma cópia do produto, para o orçamento não mudar se o cadastro mudar depois
  const [itens, setItens] = useState(() => carregarRascunho().itens)

  useEffect(() => {
    buscarProdutos()
  }, [])

  // Guarda o orçamento em andamento, para não perder se a página recarregar
  useEffect(() => {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({ cliente, observacoes, itens }))
  }, [cliente, observacoes, itens])

  const buscarProdutos = async () => {
    setCarregando(true)
    try {
      const response = await fetch(`${API_URL}/api/produtos`)
      const data = await response.json()
      if (!response.ok || !Array.isArray(data)) {
        throw new Error(data?.erro || `Resposta inesperada da API (${response.status})`)
      }
      setProdutos(data)
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
      setProdutos([])
    } finally {
      setCarregando(false)
    }
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const adicionarItem = (produto) => {
    setItens(atuais => {
      const existente = atuais.find(item => item.id === produto.id)
      if (existente) {
        return atuais.map(item =>
          item.id === produto.id ? { ...item, quantidade: (Number(item.quantidade) || 0) + 1 } : item
        )
      }
      return [...atuais, {
        id: produto.id,
        nome: produto.nome,
        preco_venda: produto.preco_venda,
        desconto: produto.desconto || 0,
        quantidade: 1
      }]
    })
  }

  const alterarQuantidade = (id, valor) => {
    setItens(atuais => atuais.map(item =>
      item.id === id ? { ...item, quantidade: valor } : item
    ))
  }

  const removerItem = (id) => {
    setItens(atuais => atuais.filter(item => item.id !== id))
  }

  const limparOrcamento = () => {
    if (!window.confirm('Limpar todos os itens deste orçamento?')) return
    setItens([])
    setCliente('')
    setObservacoes('')
  }

  const quantidadeDe = (item) => Math.max(Number(item.quantidade) || 0, 0)
  const subtotalDe = (item) => quantidadeDe(item) * calcularPrecoComDesconto(item.preco_venda, item.desconto)

  const totalSemDesconto = itens.reduce((soma, item) => soma + quantidadeDe(item) * item.preco_venda, 0)
  const total = itens.reduce((soma, item) => soma + subtotalDe(item), 0)
  const economia = totalSemDesconto - total
  const dataHoje = new Date().toLocaleDateString('pt-BR')

  return (
    <>
      {/* ===== Tela (não sai na impressão) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Coluna de Busca */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Adicionar Produtos</h2>

            <input
              type="text"
              placeholder="Digite o nome do produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-3 border-2 border-deposito-laranja rounded-lg focus:outline-none focus:ring-2 focus:ring-deposito-laranja text-lg"
              autoFocus
            />

            <p className="mt-4 text-gray-600 text-sm">
              {carregando ? 'Carregando produtos...' : 'Clique num produto para incluir no orçamento'}
            </p>

            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {produtosFiltrados.map(produto => (
                <button
                  key={produto.id}
                  onClick={() => adicionarItem(produto)}
                  className="w-full text-left px-4 py-3 rounded-lg transition bg-gray-100 hover:bg-gray-200 text-gray-800 flex justify-between items-center gap-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{produto.nome}</span>
                    <span className="block text-sm opacity-75">
                      {formatarMoeda(calcularPrecoComDesconto(produto.preco_venda, produto.desconto))}
                    </span>
                  </span>
                  <span className="text-deposito-azul font-bold text-xl">＋</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna do Orçamento */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🧾 Orçamento</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className="block">
                <span className="text-gray-700 text-sm font-semibold">Cliente (opcional)</span>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nome do cliente"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </label>
              <label className="block">
                <span className="text-gray-700 text-sm font-semibold">Observações (opcional)</span>
                <input
                  type="text"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex.: entrega no sábado"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </label>
            </div>

            {itens.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                👈 Nenhum produto ainda. Busque e clique nos produtos para montar o orçamento.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 border-b-2 border-gray-400">
                      <th className="text-left px-3 py-2 font-semibold text-gray-700">Produto</th>
                      <th className="text-center px-3 py-2 font-semibold text-gray-700">Qtd</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-700">Unitário</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-700">Subtotal</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map(item => (
                      <tr key={item.id} className="border-b border-gray-300">
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {item.nome}
                          {item.desconto > 0 && (
                            <span className="block text-xs text-orange-600">{item.desconto}% de desconto</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.quantidade}
                            onChange={(e) => alterarQuantidade(item.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700 whitespace-nowrap">
                          {formatarMoeda(calcularPrecoComDesconto(item.preco_venda, item.desconto))}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold whitespace-nowrap">
                          {formatarMoeda(subtotalDe(item))}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removerItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Remover"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                {economia > 0.005 && (
                  <p className="text-sm text-orange-700">Economia com descontos: {formatarMoeda(economia)}</p>
                )}
                <p className="text-2xl sm:text-3xl font-bold text-deposito-azul">
                  Total: {formatarMoeda(total)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={limparOrcamento}
                  disabled={itens.length === 0}
                  className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Limpar
                </button>
                <button
                  onClick={() => window.print()}
                  disabled={itens.length === 0}
                  className="bg-deposito-azul hover:bg-deposito-laranja-escuro disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg"
                >
                  🖨️ Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Folha impressa (só aparece na impressão) ===== */}
      <div className="hidden print:block text-black text-sm">
        <div className="flex items-center justify-between border-b-4 border-deposito-azul pb-3 mb-4">
          <img src="/logo-512x512.png" alt="Depósito Piauí" className="h-20" />
          <div className="text-right">
            <p className="text-2xl font-bold">ORÇAMENTO</p>
            <p>Data: {dataHoje}</p>
          </div>
        </div>

        {cliente && <p className="mb-1"><strong>Cliente:</strong> {cliente}</p>}
        {observacoes && <p className="mb-1"><strong>Observações:</strong> {observacoes}</p>}

        <table className="w-full border-collapse mt-3">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-1 pr-2">Produto</th>
              <th className="text-center py-1 px-2">Qtd</th>
              <th className="text-right py-1 px-2">Unitário</th>
              <th className="text-right py-1 pl-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {itens.map(item => (
              <tr key={item.id} className="border-b border-gray-400">
                <td className="py-1 pr-2">
                  {item.nome}
                  {item.desconto > 0 && <span> ({item.desconto}% desc.)</span>}
                </td>
                <td className="text-center py-1 px-2">{quantidadeDe(item).toLocaleString('pt-BR')}</td>
                <td className="text-right py-1 px-2 whitespace-nowrap">
                  {formatarMoeda(calcularPrecoComDesconto(item.preco_venda, item.desconto))}
                </td>
                <td className="text-right py-1 pl-2 whitespace-nowrap">{formatarMoeda(subtotalDe(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          {economia > 0.005 && <p>Economia com descontos: {formatarMoeda(economia)}</p>}
          <p className="text-xl font-bold">TOTAL: {formatarMoeda(total)}</p>
        </div>

        <p className="mt-8 text-xs text-gray-600">
          Orçamento sujeito a alteração de preços e disponibilidade de estoque.
        </p>
      </div>
    </>
  )
}
