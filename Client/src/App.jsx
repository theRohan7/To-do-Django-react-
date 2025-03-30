import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import { AuthProvider } from "./Contexts/AuthContext";

function App() {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
