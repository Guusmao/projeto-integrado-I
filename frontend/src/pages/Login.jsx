import { useState } from 'react'
import API_URL from '../config'

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, senha })
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(usuario)
      } else {
        setErro(data.erro || 'Erro ao fazer login')
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor. Certifique-se de que o backend está rodando na porta 5000')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deposito-laranja to-deposito-azul flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📦</h1>
          <h2 className="text-3xl font-bold text-gray-800">Depósito Piauí</h2>
          <p className="text-gray-600 mt-2">Sistema de Consulta de Preços</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deposito-laranja"
              disabled={carregando}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deposito-laranja"
              disabled={carregando}
            />
          </div>

          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-deposito-laranja hover:bg-deposito-laranja-escuro text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
          <p className="font-semibold mb-2">Dados de acesso (demonstração):</p>
          <p>Usuário: <code className="bg-gray-100 px-2 py-1 rounded">admin</code></p>
          <p>Senha: <code className="bg-gray-100 px-2 py-1 rounded">admin</code></p>
        </div>
      </div>
    </div>
  )
}
