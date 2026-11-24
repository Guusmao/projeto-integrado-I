import { useState } from 'react'
import API_URL from '../config'
import Etiqueta from '../components/Etiqueta'
import { IconeVoltar } from '../components/Icones'

export default function CadastroProduto({ onVoltar }) {
  const [formData, setFormData] = useState({
    nome: '',
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

    if (!formData.nome || !formData.preco_venda) {
      setMensagem('erro:Preencha o nome e o preço de venda.')
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
          preco_compra: parseFloat(formData.preco_venda) * 0.6,
          preco_venda: parseFloat(formData.preco_venda),
          desconto: formData.desconto
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMensagem(`ok:${formData.nome} cadastrado. Voltando para a lista de produtos…`)
        setFormData({
          nome: '',
          preco_venda: '',
          desconto: 0
        })
        setTimeout(() => {
          onVoltar()
        }, 1500)
      } else {
        setMensagem(`erro:Não foi possível cadastrar: ${data.erro}`)
      }
    } catch (err) {
      setMensagem('erro:Sem conexão com o servidor. Verifique a internet e tente de novo.')
      console.error('Erro:', err)
    } finally {
      setCarregando(false)
    }
  }

  const [tipoMensagem, textoMensagem] = mensagem
    ? [mensagem.slice(0, mensagem.indexOf(':')), mensagem.slice(mensagem.indexOf(':') + 1)]
    : ['', '']

  return (
    <div className="max-w-5xl">
      <button
        type="button"
        onClick={onVoltar}
        disabled={carregando}
        className="flex items-center gap-1 -ml-1 mb-2 text-azul font-semibold hover:underline"
      >
        <IconeVoltar className="w-4 h-4" />
        Produtos
      </button>
      <h1 className="largura-expandida text-3xl font-extrabold text-tinta mb-6">Novo produto</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-start">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-linha p-5 sm:p-7 space-y-5">
          {mensagem && (
            <div
              role={tipoMensagem === 'erro' ? 'alert' : 'status'}
              className={`border-l-4 px-4 py-3 font-semibold ${
                tipoMensagem === 'ok' ? 'border-ok bg-green-50 text-ok' : 'border-perigo bg-red-50 text-perigo'
              }`}
            >
              {textoMensagem}
            </div>
          )}

          <label className="block">
            <span className="font-semibold">Nome do produto</span>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex.: Cimento CP-32 (saco 50 kg)"
              className="campo mt-1.5"
              disabled={carregando}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="font-semibold">Preço de venda</span>
              <span className="relative block mt-1.5">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-concreto pointer-events-none">R$</span>
                <input
                  type="number"
                  name="preco_venda"
                  value={formData.preco_venda}
                  onChange={handleChange}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  className="campo !pl-11 tabular-nums"
                  disabled={carregando}
                />
              </span>
            </label>

            <label className="block">
              <span className="font-semibold">Desconto <span className="font-normal text-concreto">(opcional)</span></span>
              <span className="relative block mt-1.5">
                <input
                  type="number"
                  name="desconto"
                  value={formData.desconto}
                  onChange={handleChange}
                  placeholder="0"
                  step="0.1"
                  min="0"
                  max="100"
                  inputMode="decimal"
                  className="campo !pr-10 tabular-nums"
                  disabled={carregando}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-semibold text-concreto pointer-events-none">%</span>
              </span>
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onVoltar}
              disabled={carregando}
              className="sm:flex-none border-2 border-linha hover:border-concreto font-semibold py-3 px-5 rounded-md disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="flex-1 bg-azul hover:bg-azul-escuro disabled:opacity-60 text-white font-bold py-3 px-5 rounded-md"
            >
              {carregando ? 'Cadastrando…' : 'Cadastrar produto'}
            </button>
          </div>
        </form>

        {/* Prévia: a mesma etiqueta que aparece na consulta */}
        <section aria-label="Como vai aparecer na consulta">
          <p className="text-sm font-semibold text-concreto mb-3">Como vai aparecer na consulta</p>
          <p className="largura-expandida text-2xl font-extrabold leading-tight mb-4 break-words">
            {formData.nome || <span className="text-concreto/60">Nome do produto</span>}
          </p>
          <Etiqueta preco={parseFloat(formData.preco_venda) || 0} desconto={formData.desconto} compacta />
        </section>
      </div>
    </div>
  )
}
