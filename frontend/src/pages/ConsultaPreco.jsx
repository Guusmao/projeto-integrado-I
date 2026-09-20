import { useState, useEffect } from 'react'
import API_URL from '../config'

export default function ConsultaPreco() {
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    buscarProdutos()
  }, [])

  const buscarProdutos = async () => {
    setCarregando(true)
    try {
      const response = await fetch(`${API_URL}/api/produtos`)
      const data = await response.json()
      setProdutos(data)
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
    } finally {
      setCarregando(false)
    }
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const calcularPrecoComDesconto = (preco, desconto) => {
    return preco - (preco * (desconto / 100))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna de Busca */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Buscar Produto</h2>

          <input
            type="text"
            placeholder="Digite o nome do produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full px-4 py-3 border-2 border-deposito-laranja rounded-lg focus:outline-none focus:ring-2 focus:ring-deposito-laranja text-lg"
            autoFocus
          />

          <div className="mt-4">
            <p className="text-gray-600 text-sm">
              {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? 's' : ''} encontrado{produtosFiltrados.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Lista de Produtos */}
          <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
            {produtosFiltrados.map(produto => (
              <button
                key={produto.id}
                onClick={() => setProdutoSelecionado(produto)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  produtoSelecionado?.id === produto.id
                    ? 'bg-deposito-laranja text-white font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <p className="truncate font-medium">{produto.nome}</p>
                <p className="text-sm opacity-75">
                  R$ {produto.preco_venda.toFixed(2)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coluna de Detalhe */}
      <div className="lg:col-span-2">
        {produtoSelecionado ? (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg p-8 border-2 border-green-400">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              {produtoSelecionado.nome}
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600 text-sm font-semibold mb-2">PREÇO DE VENDA À VISTA</p>
                <p className="text-4xl font-bold text-deposito-azul">
                  R$ {produtoSelecionado.preco_venda.toFixed(2)}
                </p>
              </div>

              {produtoSelecionado.desconto > 0 && (
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-6 shadow-md border-2 border-orange-400">
                  <p className="text-gray-800 text-sm font-semibold mb-2">
                    PREÇO COM DESCONTO ({produtoSelecionado.desconto}%)
                  </p>
                  <p className="text-4xl font-bold text-orange-600">
                    R$ {calcularPrecoComDesconto(produtoSelecionado.preco_venda, produtoSelecionado.desconto).toFixed(2)}
                  </p>
                  <p className="text-sm text-orange-700 mt-2">
                    Economiza: R$ {(produtoSelecionado.preco_venda - calcularPrecoComDesconto(produtoSelecionado.preco_venda, produtoSelecionado.desconto)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-xl">👈 Selecione um produto na busca para ver os preços</p>
          </div>
        )}
      </div>
    </div>
  )
}
