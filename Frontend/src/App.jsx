import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";    // <-- import Dashboard
import TestFirebase from "./components/TestFirebase";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* add dashboard route */}
        <Route path="/test-firebase" element={<TestFirebase />} />
      </Routes>
    </Router>
  );
}

export default App;
