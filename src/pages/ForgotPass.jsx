import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`)
      const users = await res.json()

      if (users.length === 0) {
        throw new Error('Email não encontrado')
      }

      setUserId(users[0].id)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!newPassword) throw new Error('Digite a nova senha')

      const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      })

      if (!res.ok) throw new Error('Erro ao atualizar a senha')

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center p-8">
        <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold">Senha atualizada com sucesso!</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Ir para login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Recuperar senha</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!userId ? (
          <form onSubmit={handleEmailSubmit}>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              {isLoading ? 'Verificando...' : 'Verificar email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset}>
            <label className="block text-sm font-medium">Nova senha</label>
            <input
              type="password"
              className="mt-1 block w-full border p-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded"
            >
              {isLoading ? 'Salvando...' : 'Atualizar senha'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline text-sm"
          >
            <FiArrowLeft className="inline mr-1" />
            Voltar para o login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage;
