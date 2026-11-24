import { useState, useEffect, useRef } from 'react'
import API_URL from '../config'
import Etiqueta from '../components/Etiqueta'
import { IconeBusca } from '../components/Icones'
import { formatarMoeda, calcularPrecoComDesconto, formatarPercentual } from '../util'

export default function ConsultaPreco() {
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const detalheRef = useRef(null)

  useEffect(() => {
    buscarProdutos()
  }, [])

  const buscarProdutos = async () => {
    setCarregando(true)
    setErro('')
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
      setErro('Não foi possível carregar os produtos. Verifique a internet e tente de novo.')
    } finally {
      setCarregando(false)
    }
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const selecionar = (produto) => {
    setProdutoSelecionado(produto)
    // No celular a etiqueta fica acima da lista: leva a tela até ela
    if (window.matchMedia('(max-width: 1023px)').matches) {
      requestAnimationFrame(() => detalheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const total = produtosFiltrados.length

  return (
    <>
    <h1 className="largura-expandida text-3xl font-extrabold text-tinta mb-5">Consultar preço</h1>
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-10 items-start">
      {/* Etiqueta do produto escolhido */}
      <section ref={detalheRef} className="lg:order-2 lg:sticky lg:top-8 scroll-mt-4" aria-live="polite">
        {produtoSelecionado ? (
          <div key={produtoSelecionado.id} className="etiqueta-entrando">
            <h2 className="largura-expandida text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-5 text-tinta">
              {produtoSelecionado.nome}
            </h2>
            <Etiqueta preco={produtoSelecionado.preco_venda} desconto={produtoSelecionado.desconto} />
          </div>
        ) : (
          <div className="hidden lg:flex flex-col justify-center min-h-[22rem] border-2 border-dashed border-linha rounded-lg px-10 text-concreto">
            <p className="largura-expandida text-2xl font-bold text-tinta">Qual produto o cliente quer?</p>
            <p className="mt-2 text-lg">Busque pelo nome e escolha na lista. O preço aparece aqui.</p>
          </div>
        )}
      </section>

      {/* Busca e lista */}
      <section className="lg:order-1">
        <div className="relative">
          <IconeBusca className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-concreto pointer-events-none" />
          <input
            type="search"
            aria-label="Buscar produto pelo nome"
            placeholder="Nome do produto, ex.: cimento"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="campo campo-grande"
            autoFocus
          />
        </div>

        <p className="mt-3 mb-2 text-sm text-concreto">
          {carregando
            ? 'Carregando produtos…'
            : `${total} produto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
        </p>

        {erro && (
          <div className="mb-3 border-l-4 border-perigo bg-white px-4 py-3 text-sm">
            <p className="text-perigo font-semibold">{erro}</p>
            <button onClick={buscarProdutos} className="mt-1 font-semibold text-azul underline">Tentar de novo</button>
          </div>
        )}

        <ul className="bg-white rounded-lg border border-linha divide-y divide-linha overflow-hidden lg:max-h-[60vh] lg:overflow-y-auto">
          {produtosFiltrados.map(produto => {
            const ativo = produtoSelecionado?.id === produto.id
            const final = calcularPrecoComDesconto(produto.preco_venda, produto.desconto)
            return (
              <li key={produto.id}>
                <button
                  onClick={() => selecionar(produto)}
                  aria-pressed={ativo}
                  className={`w-full text-left flex items-center gap-3 pl-4 pr-4 py-3 border-l-[6px] transition-colors ${
                    ativo ? 'border-amarelo bg-azul text-white' : 'border-transparent hover:bg-cal'
                  }`}
                >
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-semibold">{produto.nome}</span>
                    {produto.desconto > 0 && (
                      <span className={`block text-xs ${ativo ? 'text-white/80' : 'text-concreto'}`}>
                        {formatarPercentual(produto.desconto)} de desconto: {formatarMoeda(final)}
                      </span>
                    )}
                  </span>
                  <span className="largura-condensada text-xl font-bold tabular-nums whitespace-nowrap">
                    {formatarMoeda(produto.preco_venda)}
                  </span>
                </button>
              </li>
            )
          })}
          {!carregando && !erro && total === 0 && (
            <li className="px-4 py-6 text-concreto">
              {busca ? `Nenhum produto com “${busca}”. Confira a escrita ou busque só uma parte do nome.` : 'Nenhum produto cadastrado ainda.'}
            </li>
          )}
        </ul>
      </section>
    </div>
    </>
  )
}
