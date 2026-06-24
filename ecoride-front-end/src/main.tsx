import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/global.scss'
import Home from './Home'
import CreateRideWizard from './pages/rides/CreateRideWizard'
import Login from './pages/user/Login'
import Register from './pages/user/Register'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rides/new" element={<CreateRideWizard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
