import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Beranda from "./pages/beranda";
import AboutPage  from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman default ke LandingPage */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/AboutPage" element={<AboutPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
