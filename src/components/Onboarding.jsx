import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../supabaseClient'

export default function ConversationalOnboarding({ userId, onComplete }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    preferred_name: '',
    age: '',
    location: '',
    pronouns: '',
    context: '', // Their life situation
    support_style: '', // What kind of support they want
    onboarding_complete: false
  })
  const messagesEndRef = useRef(null)

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  // Start the conversation
  useEffect(() => {
    const initialMessage = {
      role: 'assistant',
      content: 'Hi 🌱\n\nBefore we begin, what should I call you?'
    }
    setMessages([initialMessage])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Analyze the conversation to extract profile info and determine next step
      const conversationContext = messages.map(m => 
        `${m.role === 'user' ? 'User' : 'SoloEra'}: ${m.content}`
      ).join('\n')

      const analysisPrompt = `You are conducting a warm, supportive onboarding conversation for SoloEra AI, a self-care companion for women.
      CONVERSATION SO FAR: ${conversationContext}
      User: ${input.trim()}

      CURRENT PROFILE DATA:
      ${JSON.stringify(profile, null, 2)}

      YOUR TASK:
      1. Extract any new information from the user's message (name, age, location, pronouns, life context, support preferences)
      2. Determine what question to ask next following this flow:

      ONBOARDING FLOW:
      Step 1: Get their preferred name
      Step 2: After getting name, say "Great." Then explain they don't have to explain themselves, but more context helps. Invite them to share about their life, stress, goals, or how they move through the world.
      Step 3: After they share context, validate what they shared with empathy. Then ask a clarifying question with 2 options that lets them choose their support style:
        - For time-stressed people: "short, practical help that fits into busy days" OR "space to emotionally decompress when things finally slow down"
        - For ambitious/struggling people: "building structure and systems that work with your brain" OR "helping you manage the guilt and pressure when things slip"
        - For overwhelmed people: "grounding and emotional support" OR "practical help with stability and planning"
      Step 4: After they choose, acknowledge their choice and explain your approach. Then ask ONE final question to start their journey (what would help most right now, what to focus on first, etc.)
      Step 5: After they answer, welcome them warmly and mark onboarding as complete.

      RESPONSE FORMAT (JSON only, no markdown):
      {
        "extracted_info": {
          "preferred_name": "string or null",
          "age": "string or null", 
          "location": "string or null",
          "pronouns": "string or null",
          "context": "their life situation summary or null",
          "support_style": "their chosen support type or null"
        },
        "next_message": "Your empathetic, coach-like response following the flow above",
        "onboarding_complete": true or false
      }

      TONE: Warm, validating, non-judgmental, grounding. Use line breaks for readability. Keep it conversational and supportive like a caring friend.`

      const result = await model.generateContent(analysisPrompt)
      const responseText = result.response.text()
      
      // Extract JSON from response (remove markdown code blocks if present)
      let jsonText = responseText.trim()
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '')
      }
      
      const aiResponse = JSON.parse(jsonText)

      // Update profile with extracted info
      const updatedProfile = {
        ...profile,
        ...Object.fromEntries(
          Object.entries(aiResponse.extracted_info)
            .filter(([_, v]) => v !== null && v !== '')
        ),
        onboarding_complete: aiResponse.onboarding_complete
      }
      setProfile(updatedProfile)

      // Add AI message
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse.next_message
      }
      setMessages(prev => [...prev, assistantMessage])

      // If onboarding complete, save and transition
      if (aiResponse.onboarding_complete) {
        await saveProfile(updatedProfile)
      }

    } catch (error) {
      console.error('Error:', error)
      
      // Fallback to simple response if AI fails
      const fallbackMessage = {
        role: 'assistant',
        content: "I'm having a moment of technical difficulty. Could you share that again?"
      }
      setMessages(prev => [...prev, fallbackMessage])
    }

    setLoading(false)
  }

  const saveProfile = async (finalProfile) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          preferred_name: finalProfile.preferred_name,
          age: finalProfile.age ? parseInt(finalProfile.age) : null,
          location: finalProfile.location,
          pronouns: finalProfile.pronouns,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      // Wait a moment for the welcome message to be read
      setTimeout(() => {
        onComplete()
      }, 2000)

    } catch (error) {
      console.error('Error saving profile:', error)
      alert('There was an issue saving your profile. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-soloera-cream flex flex-col">
      {/* Header */}
      <div className="bg-white shadow p-6">
        <h1 className="text-3xl font-bold text-soloera-pink text-center">
          🌱 Welcome to SoloEra
        </h1>
        <p className="text-center text-gray-600 text-sm mt-2">
          Let's get to know each other
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md p-4 rounded-lg ${
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
            <div className="bg-white shadow p-4 rounded-lg border-l-4 border-soloera-pink">
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
      <div className="bg-white border-t p-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Type your response..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-soloera-sage"
            disabled={loading}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-soloera-sage text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}