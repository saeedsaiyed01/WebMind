import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner'; // Import the Toaster from Sonner
import './App.css';
import { Dashboard } from './pages/dashboard';
import LandingPage from './pages/landingPage';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setting" element={<Dashboard />} />
      </Routes>
      {/* Render the Toaster at the root so that toast notifications appear */}
      <Toaster
        position="top-right"
        
      />
    </BrowserRouter>
  );
}

export default App;
