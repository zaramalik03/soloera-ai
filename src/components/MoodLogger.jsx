import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function MoodLogger({ userId, onClose }) {
  const moods = ['😊', '😌', '😐', '😔', '😢', '😤']
  const [selected, setSelected] = useState('')
  const [notes, setNotes] = useState('')

  const saveMood = async () => {
    await supabase
      .from('mood_logs')
      .insert({
        user_id: userId,
        mood_emoji: selected,
        mood_notes: notes
      })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">How are you feeling?</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => setSelected(mood)}
              className={`text-4xl p-4 rounded ${
                selected === mood ? 'bg-soloera-pink' : 'bg-gray-100'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Any notes? (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          rows={3}
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border p-3 rounded"
          >
            Cancel
          </button>
          <button
            onClick={saveMood}
            disabled={!selected}
            className="flex-1 bg-soloera-sage text-white p-3 rounded disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}