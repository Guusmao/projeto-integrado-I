import { useState, useEffect } from 'react'
import API_URL from '../config'

export default function Dashboard({ onEditar }) {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    preco_compra: '',
    preco_venda: '',
    desconto: ''
  })

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

  const handleEditar = (produto) => {
    setProdutoEditando(produto.id)
    setFormData({
      nome: produto.nome,
      preco_compra: produto.preco_compra,
      preco_venda: produto.preco_venda,
      desconto: produto.desconto || 0
    })
  }

  const handleSalvarEdicao = async () => {
    try {
      const response = await fetch(`${API_URL}/api/produtos/${produtoEditando}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setProdutoEditando(null)
        buscarProdutos()
      }
    } catch (err) {
      console.error('Erro ao salvar:', err)
    }
  }

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/produtos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        buscarProdutos()
      }
    } catch (err) {
      console.error('Erro ao excluir:', err)
    }
  }

  const handleCancelarEdicao = () => {
    setProdutoEditando(null)
    setFormData({ nome: '', preco_compra: '', preco_venda: '', desconto: '' })
  }

  const calcularPrecoComDesconto = (preco, desconto) => {
    return preco - (preco * (desconto / 100))
  }

  if (carregando) {
    return <div className="text-center py-8">Carregando produtos...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📋 Lista de Produtos</h2>
        <button
          onClick={onEditar}
          className="bg-deposito-laranja hover:bg-deposito-laranja-escuro text-white font-bold py-2 px-4 rounded-lg"
        >
          ➕ Novo Produto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-gray-400">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Produto</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">Preço Compra</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">Preço Venda</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">Desconto</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">Preço Final</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id} className="border-b border-gray-300 hover:bg-gray-50">
                {produtoEditando === produto.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.preco_compra}
                        onChange={(e) => setFormData({ ...formData, preco_compra: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.preco_venda}
                        onChange={(e) => setFormData({ ...formData, preco_venda: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.1"
                        value={formData.desconto}
                        onChange={(e) => setFormData({ ...formData, desconto: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">
                      R$ {calcularPrecoComDesconto(formData.preco_venda, formData.desconto).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={handleSalvarEdicao}
                        className="bg-deposito-azul hover:bg-deposito-azul text-white px-3 py-1 rounded text-sm"
                      >
                        ✓ Salvar
                      </button>
                      <button
                        onClick={handleCancelarEdicao}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                      >
                        ✕ Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-gray-800">{produto.nome}</td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      R$ {produto.preco_compra.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      R$ {produto.preco_venda.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {produto.desconto}%
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-green-600">
                      R$ {calcularPrecoComDesconto(produto.preco_venda, produto.desconto).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEditar(produto)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(produto.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {produtos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum produto cadastrado. Crie um novo para começar!
        </div>
      )}
    </div>
  )
}
