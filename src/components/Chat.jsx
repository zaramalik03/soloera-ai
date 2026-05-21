import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../supabaseClient'

export default function Chat({ userId, userName }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    
    if (data) setMessages(data)
  }

  const saveMessage = async (role, content) => {
    await supabase
      .from('chat_messages')
      .insert({ user_id: userId, role, content })
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    await saveMessage('user', input)
    setInput('')
    setLoading(true)

    try {
      // Build conversation history for Gemini
      const conversationHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))

      // System prompt + conversation context
      const systemPrompt = `You are SoloEra AI, a supportive self-care companion for women. Your personality traits:
      🌱 Coach-like and grounding
      - Encourage reflection and journaling
      - Prioritize autonomy and personal growth
      - Suggest small, actionable steps

      💚 Emotionally intelligent and empathetic
      - Listen carefully and validate feelings
      - Respond with care and without judgment
      - Show genuine understanding

      🤝 Trustworthy and dependable
      - Act like a supportive best friend
      - Show up consistently without being intrusive
      - Never be offensive or possessive

      ✨ Supportive but autonomy-first
      - Encourage self-love and confidence
      - Promote real-world connections
      - Avoid creating emotional dependency

      The user's name is ${userName}. Be warm, validating, and actionable. Keep responses concise (2-3 paragraphs max). End with a thoughtful question when appropriate.

      Remember:
      - You are NOT a therapist or medical professional
      - You don't simulate romantic relationships
      - You empower independence, not dependency
      - You celebrate small wins and progress`

      // Create chat session
      const chat = model.startChat({
        history: conversationHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.9,
        },
      })

      // Send message with system context
      const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${input}`)
      const response = result.response.text()

      const assistantMessage = {
        role: 'assistant',
        content: response
      }

      setMessages(prev => [...prev, assistantMessage])
      await saveMessage('assistant', response)
    } catch (error) {
      console.error('Error:', error)
      
      // Check if it's a quota error
      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        alert('Daily API limit reached. Please try again tomorrow!')
      } else {
        alert('Failed to send message: ' + error.message)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-soloera-cream">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-soloera-pink">🌱 SoloEra AI</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-2">Hi {userName}! 🌱</p>
            <p className="text-sm">I'm here to support your self-care journey.</p>
            <p className="text-sm">How are you feeling today?</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-soloera-sage text-white'
                  : 'bg-white shadow border-l-4 border-soloera-pink'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow p-4 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-soloera-pink rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-soloera-pink rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-soloera-pink rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Share what's on your mind..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-soloera-sage"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-soloera-sage text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}