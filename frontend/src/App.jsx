import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import ConsultaPreco from './pages/ConsultaPreco'
import CadastroProduto from './pages/CadastroProduto'
import Orcamento from './pages/Orcamento'
import { IconeEtiqueta, IconeNota, IconeLista, IconeBaixar } from './components/Icones'

const TELAS = [
  { id: 'consulta', nome: 'Consultar preço', curto: 'Preço', Icone: IconeEtiqueta },
  { id: 'orcamento', nome: 'Orçamento', curto: 'Orçamento', Icone: IconeNota },
  // "Novo produto" não tem aba própria: abre pelo botão dentro de Produtos
  { id: 'dashboard', nome: 'Produtos', curto: 'Produtos', Icone: IconeLista, tambem: ['cadastro'] },
]

const abaAtiva = (aba, tela) => aba.id === tela || aba.tambem?.includes(tela)

export default function App() {
  const [telaAtual, setTelaAtual] = useState('consulta')
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }

  const irPara = (tela) => {
    setTelaAtual(tela)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen com-barra-inferior print:bg-white print:p-0">
      {/* Cabeçalho */}
      <header className="bg-azul text-white no-azul print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6 h-16 md:h-20">
          <button onClick={() => irPara('consulta')} aria-label="Depósito Piauí, ir para a consulta de preço">
            <span className="logo-recorte">
              <img src="/logo-512x512.png" alt="" />
            </span>
          </button>

          <nav className="hidden md:flex items-stretch self-stretch gap-1" aria-label="Telas">
            {TELAS.map((aba) => (
              <button
                key={aba.id}
                onClick={() => irPara(aba.id)}
                aria-current={abaAtiva(aba, telaAtual) ? 'page' : undefined}
                className={`relative px-4 font-semibold transition-colors ${
                  abaAtiva(aba, telaAtual) ? 'text-amarelo' : 'text-white/80 hover:text-white'
                }`}
              >
                {aba.nome}
                {abaAtiva(aba, telaAtual) && (
                  <span className="absolute left-4 right-4 bottom-0 h-1 bg-amarelo rounded-t" />
                )}
              </button>
            ))}
          </nav>

          {installPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 border-2 border-amarelo text-amarelo hover:bg-amarelo hover:text-azul font-semibold rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              <IconeBaixar className="w-4 h-4" />
              Instalar app
            </button>
          )}
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 print:max-w-none print:p-0">
        {telaAtual === 'consulta' && <ConsultaPreco />}
        {telaAtual === 'orcamento' && <Orcamento />}
        {telaAtual === 'dashboard' && <Dashboard onEditar={() => irPara('cadastro')} />}
        {telaAtual === 'cadastro' && <CadastroProduto onVoltar={() => irPara('dashboard')} />}
      </main>

      {/* Abas no celular: ficam ao alcance do polegar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-linha grid grid-cols-3 print:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Telas"
      >
        {TELAS.map((aba) => {
          const { id, curto, Icone } = aba
          const ativa = abaAtiva(aba, telaAtual)
          return (
            <button
              key={id}
              onClick={() => irPara(id)}
              aria-current={ativa ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 pt-2 pb-2.5 text-xs font-semibold ${ativa ? 'text-azul' : 'text-concreto'}`}
            >
              <span className={`flex items-center justify-center w-12 h-7 rounded-full transition-colors ${ativa ? 'bg-amarelo' : ''}`}>
                <Icone className="w-5 h-5" />
              </span>
              {curto}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
