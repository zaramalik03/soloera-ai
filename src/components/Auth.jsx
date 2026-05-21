import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email for verification!')
    setLoading(false)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-soloera-cream flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-soloera-pink">🌱 SoloEra AI</h1>
        
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />
          
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-soloera-sage text-white p-3 rounded hover:opacity-80"
          >
            Sign In
          </button>
          
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full border border-soloera-sage text-soloera-sage p-3 rounded hover:bg-soloera-cream"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}