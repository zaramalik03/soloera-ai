import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Onboarding from './components/Onboarding'
import Chat from './components/Chat'
import MoodLogger from './components/MoodLogger'
import Planner from './components/Planner'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [showMoodLogger, setShowMoodLogger] = useState(false)
  const [view, setView] = useState('chat')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      loadProfile()
    }
  }, [session])

  const loadProfile = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    setProfile(data)
  }

  if (!session) {
    return <Auth />
  }

  if (!profile) {
    return <Onboarding userId={session.user.id} onComplete={loadProfile} />
  }

  return (
    <div className="h-screen flex flex-col">
      {view === 'chat' && (
        <Chat userId={session.user.id} userName={profile.preferred_name} />
      )}

      {view === 'planner' && (
        <Planner userId={session.user.id} />
      )}

      {showMoodLogger && (
        <MoodLogger
          userId={session.user.id}
          onClose={() => setShowMoodLogger(false)}
        />
      )}

      <div className="bg-white border-t p-2 flex justify-around">
        <button
          onClick={() => setView('chat')}
          className={`p-3 rounded ${view === 'chat' ? 'bg-soloera-pink text-white' : ''}`}
        >
          💬 Chat
        </button>
        <button
          onClick={() => setView('planner')}
          className={`p-3 rounded ${view === 'planner' ? 'bg-soloera-pink text-white' : ''}`}
        >
          📅 Planner
        </button>
        <button
          onClick={() => setShowMoodLogger(true)}
          className="p-3 rounded"
        >
          😊 Mood
        </button>
        <button
          onClick={() => supabase.auth.signOut()}
          className="p-3 rounded"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}
