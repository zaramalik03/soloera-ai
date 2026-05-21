## SoloEra AI
SoloEra AI is a chat-based supportive self-care planner tailored for women, designed to promote self-love, emotional awareness, and healthy routines. Through mood tracking, actionable recommendations, and daily planning—delivered in a light, encouraging, coach-like tone—the product empowers users to build autonomy, set boundaries, and nurture personal growth. SoloEra AI supports women seeking emotionally intelligent guidance focused on self-care, encouragement, and life structure, without assuming or replacing romantic relationships.

## Tech-Stack:
- Frontend: React & Tailwind CSS
- Backend: Supabase (handles database, auth and storage)
- AI: Google Gemini API (requires to create an API key before using chat feature)

## Tools Needed:
- VSCode
- Node.js
- Git
- Supabase Account (free tier)
- Gemini API (free tier)

### Install Tailwind CSS
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

### Start development server
npm start

### To Install Supabase Client
npm install @supabase/supabase-js

### To Install Google Gemini API
npm install @google/generative-ai

### In .env file, generate your Google Gemini API Key from Google AI Studio
REACT_APP_GEMINI_API_KEY=your_api_key_here


