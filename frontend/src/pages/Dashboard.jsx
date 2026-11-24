import { useState, useEffect } from 'react'
import API_URL from '../config'
import { IconeLapis, IconeLixeira, IconeMais } from '../components/Icones'
import { formatarMoeda, calcularPrecoComDesconto, formatarPercentual } from '../util'

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

  const colunas = 'md:grid md:grid-cols-[minmax(0,1fr)_8rem_6.5rem_8rem_13rem] md:gap-x-4 md:items-center'

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h1 className="largura-expandida text-3xl font-extrabold text-tinta">Produtos</h1>
          <p className="text-concreto mt-1">
            {carregando ? 'Carregando…' : `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} cadastrado${produtos.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={onEditar}
          className="flex items-center gap-2 bg-azul hover:bg-azul-escuro text-white font-bold py-2.5 px-4 rounded-md whitespace-nowrap"
        >
          <IconeMais className="w-5 h-5" />
          Novo produto
        </button>
      </div>

      <div className="bg-white rounded-lg border border-linha">
        <div className={`hidden ${colunas} px-5 py-3 border-b border-linha text-sm font-semibold text-concreto`}>
          <span>Produto</span>
          <span className="text-right">Preço de venda</span>
          <span className="text-right">Desconto</span>
          <span className="text-right">Preço final</span>
          <span />
        </div>

        <ul className="divide-y divide-linha">
          {produtos.map((produto) => (
            <li key={produto.id} className={`${colunas} px-5 py-4 md:py-3 ${produtoEditando === produto.id ? 'bg-amarelo/20' : ''}`}>
              {produtoEditando === produto.id ? (
                <>
                  <label className="block mb-3 md:mb-0">
                    <span className="md:sr-only text-sm font-semibold text-concreto">Nome</span>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="campo !py-2 mt-1 md:mt-0"
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-3 md:contents">
                    <label className="block">
                      <span className="md:sr-only text-sm font-semibold text-concreto">Preço (R$)</span>
                      <input
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        value={formData.preco_venda}
                        onChange={(e) => setFormData({ ...formData, preco_venda: parseFloat(e.target.value) })}
                        className="campo !py-2 mt-1 md:mt-0 text-right tabular-nums"
                      />
                    </label>
                    <label className="block">
                      <span className="md:sr-only text-sm font-semibold text-concreto">Desconto (%)</span>
                      <input
                        type="number"
                        step="0.1"
                        inputMode="decimal"
                        value={formData.desconto}
                        onChange={(e) => setFormData({ ...formData, desconto: parseFloat(e.target.value) })}
                        className="campo !py-2 mt-1 md:mt-0 text-right tabular-nums"
                      />
                    </label>
                    <div className="block">
                      <span className="md:sr-only text-sm font-semibold text-concreto">Final</span>
                      <p className="mt-1 md:mt-0 py-2 text-right font-bold tabular-nums">
                        {formatarMoeda(calcularPrecoComDesconto(formData.preco_venda, formData.desconto))}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0 md:justify-end">
                    <button
                      onClick={handleSalvarEdicao}
                      className="flex-1 md:flex-none bg-azul hover:bg-azul-escuro text-white font-bold px-4 py-2 rounded-md"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={handleCancelarEdicao}
                      className="flex-1 md:flex-none border-2 border-linha hover:border-concreto font-semibold px-4 py-1.5 rounded-md"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold">{produto.nome}</p>
                  <div className="flex flex-wrap items-baseline gap-x-2 mt-1 md:contents text-sm md:text-base">
                    <span className={`md:text-right tabular-nums ${produto.desconto > 0 ? 'text-concreto line-through md:no-underline md:text-tinta' : 'hidden md:block'}`}>
                      {formatarMoeda(produto.preco_venda)}
                    </span>
                    <span className={`md:text-right tabular-nums text-concreto ${produto.desconto > 0 ? '' : 'hidden md:block'}`}>
                      {produto.desconto > 0 ? (
                        <span className="inline-block bg-amarelo text-azul font-bold rounded px-1.5 text-sm">−{formatarPercentual(produto.desconto)}</span>
                      ) : (
                        <span className="hidden md:inline">sem desconto</span>
                      )}
                    </span>
                    <span className="md:text-right font-bold text-azul tabular-nums largura-condensada text-lg md:text-xl">
                      {formatarMoeda(calcularPrecoComDesconto(produto.preco_venda, produto.desconto))}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-1 -ml-3 md:ml-0 md:mt-0 md:justify-end">
                    <button
                      onClick={() => handleEditar(produto)}
                      className="flex items-center gap-1.5 text-azul font-semibold px-3 py-2 rounded-md hover:bg-cal"
                    >
                      <IconeLapis className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(produto.id)}
                      className="flex items-center gap-1.5 text-perigo font-semibold px-3 py-2 rounded-md hover:bg-red-50"
                    >
                      <IconeLixeira className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {!carregando && produtos.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="largura-expandida text-xl font-bold">Nenhum produto cadastrado</p>
            <p className="text-concreto mt-1">Cadastre o primeiro em “Novo produto”.</p>
          </div>
        )}
      </div>
    </div>
  )
}
