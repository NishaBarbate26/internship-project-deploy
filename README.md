# Travel Guide RAG Assistant

## Project Overview

Travel Guide RAG Assistant is a full-stack web application that generates personalized travel itineraries using AI. Users can fill out a form with their travel preferences, receive AI-generated itineraries, chat with their itinerary to make modifications, and export finalized plans as Markdown files.

### Core Features

- **Personalized Itinerary Generation**: AI-powered travel plans based on detailed user preferences
- **Interactive Chat Interface**: Modify and refine itineraries through natural language conversation
- **Itinerary Management**: Save, view, and manage multiple travel itineraries
- **Export Functionality**: Download finalized itineraries as well-formatted Markdown files
- **User Authentication**: Secure authentication using Firebase

### Target Users

- Travel enthusiasts planning trips
- Tourists seeking personalized travel plans
- Solo travelers organizing their trips
- Families planning vacations
- Students planning study abroad trips

---

## Architecture Overview

### Frontend (React)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Authentication**: Firebase SDK
- **API Communication**: Fetch API or Axios

### Backend (FastAPI)
- **Framework**: FastAPI (Python 3.12+)
- **Server**: Uvicorn
- **Database**: SQLite
- **AI Integration**: LangChain + Google Gemini LLM
- **Authentication**: Firebase token validation

### Data Flow

```
User Input (Form) 
  → Frontend (React)
    → Backend API (FastAPI)
      → LangChain + Gemini LLM
        → Generate Itinerary
          → Save to SQLite
            → Return to Frontend
              → Display to User
```

### Authentication Flow

```
User Signup/Login
  → Firebase Authentication (Frontend)
    → Firebase Token
      → Backend API (Token Validation)
        → User-Specific Data Access
```

---

## Issue Flow

This project is broken down into 14 issues, progressing from foundation to advanced features:

### Foundation Phase (Issues #01-08)

**Issue #01: Project Setup**
- Initialize project structure
- Set up backend with FastAPI and UV package manager
- Set up frontend with React and Vite
- Configure development environment

**Issue #02: Landing Page UI**
- Create static landing page
- Build hero section, features showcase, and footer
- Set up navigation structure

**Issue #03: Signup Page UI**
- Create signup form component
- Implement form validation
- Style with Tailwind CSS

**Issue #04: Login Page UI**
- Create login form component
- Implement form validation
- Style with Tailwind CSS

**Issue #05: Firebase Auth Setup**
- Create Firebase project
- Configure Firebase Authentication
- Install and configure Firebase SDK

**Issue #06: Integrate Signup with Firebase**
- Connect signup form to Firebase
- Handle authentication errors
- Implement success redirects

**Issue #07: Integrate Login with Firebase**
- Connect login form to Firebase
- Handle authentication errors
- Implement dashboard redirect

**Issue #08: Dashboard UI**
- Create protected dashboard route
- Display user information
- Implement logout functionality

### Core Features Phase (Issues #09-13)

**Issue #09: Itinerary Form & Generation**
- Create comprehensive travel preference form
- Build backend API endpoint for itinerary generation
- Integrate LangChain + Gemini LLM
- Generate and save personalized itineraries

**Issue #10: Itinerary List View**
- Create API endpoint to fetch user itineraries
- Build itinerary list component with cards
- Display all saved itineraries
- Implement navigation to detail view

**Issue #11: Itinerary Detail View**
- Create API endpoint for single itinerary
- Build detail page component
- Display complete day-by-day itinerary
- Format itinerary data beautifully

**Issue #12: Chat Interface for Modifications**
- Create chat API endpoint with LLM integration
- Build chat interface components
- Implement conversation history
- Enable itinerary modifications through chat

**Issue #13: Export & Delete Features**
- Create export endpoint (Markdown generation)
- Implement delete endpoint
- Build export and delete UI components
- Add confirmation dialogs

### Testing Phase (Issue #14)

**Issue #14: Final Testing**
- End-to-end application flow verification
- Document all pages and routes
- Document API endpoints
- Test all user interactions
- Verify error handling

---

## API Endpoints Reference

### Itinerary Endpoints

| Method | Endpoint | Protected | Purpose | LLM Integration |
|--------|----------|-----------|---------|-----------------|
| POST | `/api/itineraries` | Yes | Generate itinerary from form | Yes |
| GET | `/api/itineraries` | Yes | Get all user itineraries | No |
| GET | `/api/itineraries/:id` | Yes | Get itinerary details | No |
| POST | `/api/itineraries/:id/chat` | Yes | Chat to modify itinerary | Yes |
| DELETE | `/api/itineraries/:id` | Yes | Delete itinerary | No |
| GET | `/api/itineraries/:id/export` | Yes | Export itinerary as Markdown | No |

### Authentication

- **Signup**: Handled by Firebase SDK in frontend
- **Login**: Handled by Firebase SDK in frontend
- **Token Validation**: Backend validates Firebase tokens for protected endpoints

---

## Technology Stack

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Firebase SDK**: Authentication

### Backend
- **Python 3.12+**: Programming language
- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **LangChain**: LLM integration framework
- **Google Gemini LLM**: AI model for itinerary generation
- **SQLite**: Database for application data
- **UV**: Python package manager

### Development Tools
- **Git**: Version control
- **npm**: Node package manager
- **UV**: Python package manager

---

## Project Structure

```
travel-guide-rag-assistant/
├── Backend/
│   ├── main.py                 # FastAPI application
│   ├── services/               # Business logic
│   │   ├── itinerary_service.py
│   │   └── export_service.py
│   ├── database/               # Database models and queries
│   ├── routes/                 # API route handlers
│   ├── prompts/                # LLM prompt templates
│   ├── pyproject.toml          # Python project config
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
├── Frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ItineraryForm.jsx
│   │   │   ├── ItineraryList.jsx
│   │   │   ├── ItineraryCard.jsx
│   │   │   ├── ItineraryViewer.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   └── ExportButton.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ItineraryDetail.jsx
│   │   ├── config/             # Configuration files
│   │   │   └── firebase.js
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite configuration
│
├── issues/                      # Project issues
│   ├── issue-01-project-setup.md
│   ├── issue-02-landing-page-ui.md
│   └── ... (14 issues total)
│
├── project_details.md          # Detailed project plan
└── PROJECT-README.md           # This file
```

---

## Getting Started

### Prerequisites

- Python 3.12+
- UV package manager
- Node.js 18+
- npm or yarn
- Google API Key (for Gemini LLM)
- Firebase project (for authentication)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-guide-rag-assistant
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv add -r requirements.txt
   ```

3. **Configure Environment Variables**
   Create `.env` file in Backend directory:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

4. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```

5. **Configure Firebase**
   - Create Firebase project
   - Enable Email/Password authentication
   - Add Firebase config to `Frontend/src/config/firebase.js`

6. **Run Development Servers**
   ```bash
   # Backend (in Backend directory)
   uvicorn main:app --reload

   # Frontend (in Frontend directory)
   npm run dev
   ```

---

## Key Features Implementation

### Itinerary Generation Flow

1. User fills out travel preference form
2. Form data sent to backend API
3. Backend constructs detailed prompt with preferences
4. LangChain + Gemini LLM generates structured itinerary
5. Itinerary saved to SQLite database
6. Frontend displays generated itinerary

### Chat Modification Flow

1. User sends chat message requesting changes
2. Backend retrieves current itinerary and chat history
3. LangChain + Gemini LLM processes request with context
4. LLM generates updated itinerary and response
5. Updated itinerary saved to database
6. Frontend displays updated itinerary and chat response

### Export Flow

1. User clicks export button
2. Backend retrieves itinerary data
3. Backend formats itinerary as Markdown
4. Frontend receives Markdown content
5. Browser downloads Markdown file

---

## Database Schema (High-Level)

### Tables

**users**
- Stores user information (Firebase UID, email)
- Linked to Firebase Authentication

**itineraries**
- Stores itinerary data (destination, dates, preferences, itinerary content)
- Linked to users table

**chat_messages**
- Stores chat conversation history
- Linked to itineraries table

---

## Development Guidelines

### Code Style
- Follow React best practices
- Use functional components and hooks
- Follow FastAPI conventions
- Write clean, readable code

### Error Handling
- Implement proper error handling in all API endpoints
- Display user-friendly error messages in frontend
- Handle network errors gracefully
- Validate user inputs

### Testing
- Test all API endpoints
- Test user authentication flows
- Test LLM integration
- Test error scenarios

---

## Resources

### Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [LangChain Documentation](https://python.langchain.com/)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Google Gemini API](https://ai.google.dev/docs)

### Learning Resources
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [LangChain Getting Started](https://python.langchain.com/docs/get_started/introduction)

---

## Project Status

**Total Issues**: 14
**Current Phase**: Foundation (Issues #01-08)
**Next Phase**: Core Features (Issues #09-13)
**Final Phase**: Testing (Issue #14)

---

## License

This is an educational project for learning full-stack development with AI integration.
