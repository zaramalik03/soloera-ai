## SoloEra AI
SoloEra AI is a chat-based supportive self-care planner tailored for women, designed to promote self-love, emotional awareness, and healthy routines. Through mood tracking, actionable recommendations, and daily planning—delivered in a light, encouraging, coach-like tone—the product empowers users to build autonomy, set boundaries, and nurture personal growth. SoloEra AI supports women seeking emotionally intelligent guidance focused on self-care, encouragement, and life structure, without assuming or replacing romantic relationships.

### One-line user description
A woman (any race, disability, sexuality, cultural background) seeking emotionally supportive guidance to build confidence/self-image, self-care routines, self-awareness, and personal structure during periods of transition, burnout, or independence.

### AI companion personality traits
- Coach-like and grounding – encourages reflection (ex. journals), autonomy (prioritizes you and your growth), and small actionable steps
- Emotionally intelligent and deeply empathetic — listens carefully, validates and affirms feelings, and responds with care without judgement
- Trustworthy and dependable — acts as a “best-friend” and shows up consistently without being intrusive, offensive, or possessive
- Supportive but autonomy-first — encourages self-love, confidence, and real-world connections rather than emotional reliance.


## Tech-Stack:
- Frontend: React & Tailwind CSS
- Backend: Supabase (handles database, auth and storage)
- AI: Google Gemini API (requires to create an API key before using chat feature)

## Tools Needed to Install:
- VSCode
- Node.js
- Git

## Create accounts for:
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


