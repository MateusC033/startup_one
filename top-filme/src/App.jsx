import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Dashboard from './pages/Dashboard'
import ParaEmpresas from './pages/ParaEmpresas'
import Planos from './pages/Planos'
import EmpresaLogin from './pages/EmpresaLogin'
import Perfil from './pages/Perfil'
import Servicos from './pages/Servicos'
import PainelConta from './pages/PainelConta'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/para-empresas" element={<ParaEmpresas />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/planos" element={<Navigate to="/servicos" replace />} />
        <Route path="/painel/conta" element={<PainelConta />} />
        <Route path="/empresas/login" element={<EmpresaLogin />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
