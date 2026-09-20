import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ConsultaPreco from './pages/ConsultaPreco'
import CadastroProduto from './pages/CadastroProduto'

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(false)
  const [telaAtual, setTelaAtual] = useState('consulta')
  const [installPrompt, setInstallPrompt] = useState(null)

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

  if (!usuarioLogado) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-deposito-laranja text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <img src="/logo-512x512.png" alt="Depósito Piauí" className="h-32" />
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
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
      </nav>

      {/* Conteúdo */}
      <main className="max-w-6xl mx-auto p-6">
        {telaAtual === 'consulta' && <ConsultaPreco />}
        {telaAtual === 'dashboard' && <Dashboard onEditar={() => setTelaAtual('cadastro')} />}
        {telaAtual === 'cadastro' && <CadastroProduto onVoltar={() => setTelaAtual('dashboard')} />}
      </main>
    </div>
  )
}
