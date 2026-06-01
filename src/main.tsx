import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CourseProvider } from './context/CourseContext.tsx'
import { ProfileProvider } from './context/ProfileContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)


