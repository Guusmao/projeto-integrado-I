import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ConsultaPreco from './pages/ConsultaPreco'
import CadastroProduto from './pages/CadastroProduto'

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(false)
  const [telaAtual, setTelaAtual] = useState('consulta')
  const [installPrompt, setInstallPrompt] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const usuario = localStorage.getItem('usuario')
    if (usuario) {
      setUsuarioLogado(true)
    }
  }, [])

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

  const handleLogin = (usuario) => {
    localStorage.setItem('usuario', usuario)
    setUsuarioLogado(true)
    setTelaAtual('consulta')
  }

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    setUsuarioLogado(false)
    setTelaAtual('consulta')
  }

  const handleNavClick = (tela) => {
    setTelaAtual(tela)
    setMobileMenuOpen(false)
  }

  if (!usuarioLogado) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-deposito-laranja text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <img src="/logo-512x512.png" alt="Depósito Piauí" className="h-20 sm:h-32" />

          {/* Menu Hamburger (mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>

          {/* Menu Desktop */}
          <div className="hidden md:flex flex-wrap gap-2 sm:gap-4 items-center">
            <button
              onClick={() => setTelaAtual('consulta')}
              className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded ${telaAtual === 'consulta' ? 'bg-deposito-azul' : 'hover:bg-deposito-laranja-escuro'}`}
            >
              Consultar Preço
            </button>
            <button
              onClick={() => setTelaAtual('dashboard')}
              className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded ${telaAtual === 'dashboard' ? 'bg-deposito-azul' : 'hover:bg-deposito-laranja-escuro'}`}
            >
              Produtos
            </button>
            <button
              onClick={() => setTelaAtual('cadastro')}
              className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded ${telaAtual === 'cadastro' ? 'bg-deposito-azul' : 'hover:bg-deposito-laranja-escuro'}`}
            >
              Novo Produto
            </button>
            {installPrompt && (
              <button
                onClick={handleInstallClick}
                className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-green-500 hover:bg-green-600 rounded font-semibold"
              >
                ⬇️ Instalar App
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-red-500 hover:bg-red-600 rounded"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-deposito-laranja-escuro w-full">
            <button
              onClick={() => handleNavClick('consulta')}
              className={`w-full text-left px-4 py-3 ${telaAtual === 'consulta' ? 'bg-deposito-azul' : 'hover:bg-deposito-azul hover:bg-opacity-50'}`}
            >
              Consultar Preço
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full text-left px-4 py-3 ${telaAtual === 'dashboard' ? 'bg-deposito-azul' : 'hover:bg-deposito-azul hover:bg-opacity-50'}`}
            >
              Produtos
            </button>
            <button
              onClick={() => handleNavClick('cadastro')}
              className={`w-full text-left px-4 py-3 ${telaAtual === 'cadastro' ? 'bg-deposito-azul' : 'hover:bg-deposito-azul hover:bg-opacity-50'}`}
            >
              Novo Produto
            </button>
            {installPrompt && (
              <button
                onClick={() => {
                  handleInstallClick()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-3 bg-green-600 hover:bg-green-700"
              >
                ⬇️ Instalar App
              </button>
            )}
            <button
              onClick={() => {
                handleLogout()
                setMobileMenuOpen(false)
              }}
              className="w-full text-left px-4 py-3 bg-red-600 hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        )}
      </nav>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {telaAtual === 'consulta' && <ConsultaPreco />}
        {telaAtual === 'dashboard' && <Dashboard onEditar={() => setTelaAtual('cadastro')} />}
        {telaAtual === 'cadastro' && <CadastroProduto onVoltar={() => setTelaAtual('dashboard')} />}
      </main>
    </div>
  )
}
