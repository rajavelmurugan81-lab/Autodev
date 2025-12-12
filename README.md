# AutoDev CAP (Collaborative Agentic Platform)

A multi-agent development platform powered by **Google Gemini 2.5 Flash**.

## Features
- **Project Generation**: Converts user stories into full-stack code (React + Node.js + SQL).
- **Agent Orchestration**: Visualizes the workflow of multiple agents (Prompt Refiner, Story Parser, DB Schema, Backend, Frontend, Test).
- **Artifact Preview**: View generated code directly in the browser.
- **Legacy Code Analysis**: Upload existing code to get insights and refactoring suggestions.

## Prerequisites
- Node.js (v18+)
- Python (3.9+)

## Setup

1.  **Clone the repository**
2.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    ```
4.  **Environment Variables**
    - Create a `.env` file in the root directory (copy from `.env.example`).
    - Add your Google Gemini API Key:
    ```
    GEMINI_API_KEY=your_actual_api_key_here
    ```

## How to Run

1.  **Start the Backend**
    From the root directory:
    ```bash
    uvicorn backend.main:app --reload
    ```
    The API will run at `http://127.0.0.1:8000`.

2.  **Start the Frontend**
    From the `frontend` directory:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Architecture
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons, PrismJS.
- **Backend**: FastAPI, Google Generative AI SDK, Uvicorn.
- **Orchestrator**: Custom Python-based agent coordinator.
