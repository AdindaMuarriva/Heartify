import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman default ke LandingPage */}
        <Route path="/" element={<LandingPage />} />

        {/* Halaman lain */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;