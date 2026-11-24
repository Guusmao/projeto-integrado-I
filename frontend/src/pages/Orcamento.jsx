import { useState, useEffect } from 'react'
import API_URL from '../config'
import { IconeBusca, IconeMais, IconeLixeira, IconeImpressora } from '../components/Icones'
import { formatarMoeda, calcularPrecoComDesconto, formatarPercentual } from '../util'

const CHAVE_RASCUNHO = 'orcamento-rascunho'

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

  const colunas = 'grid grid-cols-[minmax(0,1fr)_auto_auto] sm:grid-cols-[minmax(0,1fr)_5.5rem_7.5rem_8rem_2.75rem] gap-x-3'

  return (
    <>
      {/* ===== Tela (não sai na impressão) ===== */}
      <div className="print:hidden">
        <h1 className="largura-expandida text-3xl font-extrabold text-tinta mb-5">Orçamento</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-8 items-start">
          {/* Coluna de busca */}
          <section className="lg:sticky lg:top-8" aria-label="Adicionar produtos">
            <div className="relative">
              <IconeBusca className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-concreto pointer-events-none" />
              <input
                type="search"
                aria-label="Buscar produto para adicionar"
                placeholder="Adicionar produto…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="campo campo-grande"
                autoFocus
              />
            </div>

            <p className="mt-3 mb-2 text-sm text-concreto">
              {carregando ? 'Carregando produtos…' : 'Toque num produto para incluir. Tocar de novo soma mais um.'}
            </p>

            <ul className="bg-white rounded-lg border border-linha divide-y divide-linha overflow-y-auto max-h-72 lg:max-h-[60vh]">
              {produtosFiltrados.map(produto => {
                const qtdNoOrcamento = itens.find(item => item.id === produto.id)?.quantidade
                return (
                  <li key={produto.id}>
                    <button
                      onClick={() => adicionarItem(produto)}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-cal group"
                    >
                      <span className="flex-1 min-w-0">
                        <span className="block truncate font-semibold">{produto.nome}</span>
                        <span className="block text-sm text-concreto tabular-nums">
                          {formatarMoeda(calcularPrecoComDesconto(produto.preco_venda, produto.desconto))}
                          {qtdNoOrcamento ? (
                            <span className="ml-2 text-xs font-bold bg-amarelo text-azul rounded px-1.5 py-0.5 whitespace-nowrap">
                              {Number(qtdNoOrcamento).toLocaleString('pt-BR')} no orçamento
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-azul text-azul group-hover:bg-azul group-hover:text-white transition-colors" aria-hidden="true">
                        <IconeMais className="w-5 h-5" />
                      </span>
                    </button>
                  </li>
                )
              })}
              {!carregando && produtosFiltrados.length === 0 && (
                <li className="px-4 py-5 text-concreto">Nenhum produto com esse nome.</li>
              )}
            </ul>
          </section>

          {/* A folha do orçamento */}
          <section className="bg-white rounded-lg border border-linha" aria-label="Itens do orçamento">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-6 border-b border-linha">
              <label className="block">
                <span className="text-sm font-semibold text-concreto">Cliente (opcional)</span>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nome do cliente"
                  className="campo mt-1"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-concreto">Observações (opcional)</span>
                <input
                  type="text"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex.: entrega no sábado"
                  className="campo mt-1"
                />
              </label>
            </div>

            {itens.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <p className="largura-expandida text-xl font-bold text-tinta">Orçamento vazio</p>
                <p className="mt-1 text-concreto">Busque os produtos ao lado e toque neles para montar o orçamento.</p>
              </div>
            ) : (
              <div className="px-5 sm:px-6">
                <div className={`${colunas} hidden sm:grid py-3 text-sm font-semibold text-concreto border-b border-linha`}>
                  <span>Produto</span>
                  <span className="text-center">Qtd</span>
                  <span className="text-right">Unitário</span>
                  <span className="text-right">Subtotal</span>
                  <span />
                </div>
                <ul className="divide-y divide-linha">
                  {itens.map(item => {
                    const unitario = calcularPrecoComDesconto(item.preco_venda, item.desconto)
                    return (
                      <li key={item.id} className={`${colunas} gap-y-2 items-center py-3`}>
                        <div className="col-span-3 sm:col-span-1 min-w-0">
                          <p className="font-semibold">{item.nome}</p>
                          {item.desconto > 0 && (
                            <p className="text-xs text-concreto">{formatarPercentual(item.desconto)} de desconto</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 sm:justify-center">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            inputMode="decimal"
                            aria-label={`Quantidade de ${item.nome}`}
                            value={item.quantidade}
                            onChange={(e) => alterarQuantidade(item.id, e.target.value)}
                            className="campo !w-20 !py-1.5 !px-2 text-center tabular-nums font-semibold"
                          />
                          <span className="sm:hidden text-sm text-concreto whitespace-nowrap tabular-nums">× {formatarMoeda(unitario)}</span>
                        </div>
                        <span className="hidden sm:block text-right tabular-nums whitespace-nowrap">{formatarMoeda(unitario)}</span>
                        <span className="text-right font-bold tabular-nums whitespace-nowrap">{formatarMoeda(subtotalDe(item))}</span>
                        <button
                          onClick={() => removerItem(item.id)}
                          className="justify-self-end flex items-center justify-center w-10 h-10 rounded-md text-concreto hover:text-perigo hover:bg-red-50"
                          title="Remover do orçamento"
                          aria-label={`Remover ${item.nome}`}
                        >
                          <IconeLixeira className="w-5 h-5" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 px-5 sm:px-6 py-5 bg-azul text-white rounded-b-lg no-azul">
              <div>
                <p className="font-semibold text-white/80">Total</p>
                <p className="largura-condensada text-5xl font-extrabold leading-none tabular-nums text-amarelo">
                  {formatarMoeda(total)}
                </p>
                {economia > 0.005 && (
                  <p className="mt-2 text-sm text-white/80">Economia com descontos: {formatarMoeda(economia)}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={limparOrcamento}
                  disabled={itens.length === 0}
                  className="flex-1 sm:flex-none font-semibold py-3 px-5 rounded-md border-2 border-white/40 hover:border-white disabled:opacity-40 disabled:pointer-events-none"
                >
                  Limpar
                </button>
                <button
                  onClick={() => window.print()}
                  disabled={itens.length === 0}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-bold py-3 px-5 rounded-md bg-amarelo text-azul hover:bg-white disabled:opacity-40 disabled:pointer-events-none"
                >
                  <IconeImpressora className="w-5 h-5" />
                  Imprimir
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ===== Folha impressa (só aparece na impressão) ===== */}
      <div className="hidden print:block text-black text-sm">
        <div className="flex items-center justify-between border-b-4 border-azul pb-3 mb-4">
          <span className="logo-recorte" style={{ '--h': '64px' }}><img src="/logo-512x512.png" alt="Depósito Piauí" /></span>
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
