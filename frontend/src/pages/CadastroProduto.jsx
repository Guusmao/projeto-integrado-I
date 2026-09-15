import { useState } from 'react'
import API_URL from '../config'

export default function CadastroProduto({ onVoltar }) {
  const [formData, setFormData] = useState({
    nome: '',
    preco_compra: '',
    preco_venda: '',
    desconto: 0
  })
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'desconto' ? parseFloat(value) || 0 : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setMensagem('')

    if (!formData.nome || !formData.preco_compra || !formData.preco_venda) {
      setMensagem('❌ Preencha todos os campos obrigatórios')
      setCarregando(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: formData.nome,
          preco_compra: parseFloat(formData.preco_compra),
          preco_venda: parseFloat(formData.preco_venda),
          desconto: formData.desconto
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMensagem('✅ Produto cadastrado com sucesso!')
        setFormData({
          nome: '',
          preco_compra: '',
          preco_venda: '',
          desconto: 0
        })
        setTimeout(() => {
          onVoltar()
        }, 1500)
      } else {
        setMensagem(`❌ Erro ao cadastrar: ${data.erro}`)
      }
    } catch (err) {
      setMensagem('❌ Erro ao conectar com o servidor')
      console.error('Erro:', err)
    } finally {
      setCarregando(false)
    }
  }

  const calcularPrecoComDesconto = () => {
    if (!formData.preco_venda) return 0
    const preco = parseFloat(formData.preco_venda)
    const desconto = parseFloat(formData.desconto) || 0
    return preco - (preco * (desconto / 100))
  }

  const calcularMargem = () => {
    if (!formData.preco_compra || !formData.preco_venda) return 0
    const compra = parseFloat(formData.preco_compra)
    const venda = parseFloat(formData.preco_venda)
    return (((venda - compra) / compra) * 100).toFixed(1)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">➕ Novo Produto</h2>

        {mensagem && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            mensagem.startsWith('✅')
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}>
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nome do Produto <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Cimento CP-32 (saco 50kg)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deposito-laranja"
              disabled={carregando}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Preço de Compra <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center">
                <span className="text-gray-700 font-semibold mr-2">R$</span>
                <input
                  type="number"
                  name="preco_compra"
                  value={formData.preco_compra}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deposito-laranja"
                  disabled={carregando}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Preço de Venda <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center">
                <span className="text-gray-700 font-semibold mr-2">R$</span>
                <input
                  type="number"
                  name="preco_venda"
                  value={formData.preco_venda}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deposito-laranja"
                  disabled={carregando}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Desconto (%) <span className="text-gray-500 text-sm">(opcional)</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                name="desconto"
                value={formData.desconto}
                onChange={handleChange}
                placeholder="0"
                step="0.1"
                min="0"
                max="100"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deposito-laranja"
                disabled={carregando}
              />
              <span className="text-gray-700 font-semibold ml-2">%</span>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">📊 Preview</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-600 text-sm mb-1">Preço Venda</p>
                <p className="text-2xl font-bold text-deposito-azul">
                  R$ {formData.preco_venda ? parseFloat(formData.preco_venda).toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Preço Final</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {calcularPrecoComDesconto().toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Margem Lucro</p>
                <p className="text-2xl font-bold text-purple-600">
                  {calcularMargem()}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={carregando}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {carregando ? 'Salvando...' : '✅ Cadastrar Produto'}
            </button>
            <button
              type="button"
              onClick={onVoltar}
              disabled={carregando}
              className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              ← Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
