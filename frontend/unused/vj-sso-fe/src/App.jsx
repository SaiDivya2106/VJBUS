import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import Redirecting from "./pages/Redirecting";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/redirect" element={<Redirecting />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
