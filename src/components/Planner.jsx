import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Planner({ userId }) {
  const [activities, setActivities] = useState([])
  const [newActivity, setNewActivity] = useState('')

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    const { data } = await supabase
      .from('planner_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (data) setActivities(data)
  }

  const addActivity = async () => {
    if (!newActivity.trim()) return

    await supabase
      .from('planner_activities')
      .insert({
        user_id: userId,
        activity_text: newActivity
      })

    setNewActivity('')
    loadActivities()
  }

  const toggleComplete = async (id, completed) => {
    await supabase
      .from('planner_activities')
      .update({ completed: !completed })
      .eq('id', id)

    loadActivities()
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Planner</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addActivity()}
          placeholder="Add an activity..."
          className="flex-1 p-3 border rounded"
        />
        <button
          onClick={addActivity}
          className="bg-soloera-sage text-white px-6 py-3 rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {activities.map(activity => (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-3 bg-white rounded shadow"
          >
            <input
              type="checkbox"
              checked={activity.completed}
              onChange={() => toggleComplete(activity.id, activity.completed)}
              className="w-5 h-5"
            />
            <span className={activity.completed ? 'line-through text-gray-500' : ''}>
              {activity.activity_text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}